import { debounce } from 'throttle-debounce'

import { HttpEnum } from '@/enums/HttpEnum'
import { PageEnum } from '@/enums/PageEnum'
import { type CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store'

function createLoadingManager() {
  let count = 0
  let shown = false
  const show = debounce(200, function () {
    uni.showLoading({ title: '加载中...' })
    shown = true
  })
  return {
    hideLoading() {
      if (--count <= 0) {
        count = 0
        show.cancel()
        if (shown) {
          uni.hideLoading()
          shown = false
        }
      }
    },
    showLoading() {
      if (count++ === 0) show()
    },
  }
}

const { hideLoading, showLoading } = createLoadingManager()

export function http<T>(options: CustomRequestOptions) {
  return new Promise<IResData<T>>((resolve, reject) => {
    !options.hideErrorToast && showLoading()
    uni.request({
      ...options,
      dataType: 'json',
      // 响应失败
      fail(err) {
        hideLoading()

        uni.showToast({
          duration: 1000 * 2,
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        hideLoading()
        const userStore = useUserStore()

        const result = res.data as IResData<T>
        const code = (result as any)[HttpEnum.RESPONSE_CODE_FIELD] + ''
        const msg = (result as any)[HttpEnum.RESPONSE_MSG_FIELD]

        if (HttpEnum.SUCCESS_CODE_ARR.includes(code)) {
          resolve(result)
        } else if (code === HttpEnum.RESPONSE_CODE_ERROR_AUTH) {
          // 401错误  -> 清理用户信息，跳转到登录页
          userStore.clearUserInfo()
          uni.showToast({
            duration: 1000 * 2,
            icon: 'none',
            title: '登录过期, 请重新登录',
          })
          uni.navigateTo({ url: PageEnum.LOGIN_PATH })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              duration: 1000 * 2,
              icon: 'none',
              title: msg || '请求错误',
            })
          reject(res)
        }
      },
      timeout: HttpEnum.TIMEOUT,
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export function httpGet<T>(url: string, query?: Record<string, any>) {
  return http<T>({
    method: 'GET',
    query,
    url,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export function httpPost<T>(url: string, data?: Record<string, any>, query?: Record<string, any>) {
  return http<T>({
    data,
    method: 'POST',
    query,
    url,
  })
}

http.get = httpGet
http.post = httpPost
