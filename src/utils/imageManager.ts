/**
 * 图片管理工具
 * 支持导入导出所有图片，并提供开关控制使用变量拼接还是直接引入图片
 */

// SVG 图标资源导入 - 从 static/icons 目录导入
import PLATFORM from './platform'

// Tabbar 图标
const tabbarImage = [
  'tabbarHome',
  'tabbarHomeActive',
  'tabbarResident',
  'tabbarResidentActive',
  'tabbarMessage',
  'tabbarMessageActive',
  'tabbarMine',
  'tabbarMineActive',
] as const

// dashboard 图标
const dashboardImage = ['dashboardCover', 'dashboardTitle'] as const

// user
const userImage = ['userLoginBg'] as const

// mine
const mineImage = [
  'mineAvatar',
  'mineList1',
  'mineList2',
  'mineList3',
  'mineList4',
  'mineList5',
  'mineQrcode',
  'mineTag1',
  'mineTag2',
  'mineUserTag',
  'mineScanQrcodeBgCover',
  'mineMyTeamList1',
  'mineMyTeamList2',
  'mineMyTeamList3',
  'mineMyTeamList4',
] as const

// home
const homeImage = ['homeCreate1', 'homeCreate2', 'homeCreate3'] as const

const commonImage = [
  'commonArrowRight',
  'commonBoy',
  'commonGirl',
  'commonSuccess',
  'commonFail',
  'commonEmpty',
  'commonSearch',
  'commonFemale',
  'commonMale',
  'commonAdd',
] as const
const residentImage = ['residentTag1', 'residentTag2', 'residentTag3'] as const

const imageNames = [
  ...tabbarImage,
  ...dashboardImage,
  ...userImage,
  ...mineImage,
  ...homeImage,
  ...commonImage,
  ...residentImage,
] as const

const isHttpImage = PLATFORM.isMp
const imageBaseUrl = 'https://complete-medical-care-uniapp.netlify.app'
/**
 * 图片名称类型
 */
type ImageName = (typeof imageNames)[number]

/**
 * 获取图片资源
 * @param imageName 图片名称
 * @returns 图片URL或导入的资源
 */
export function getImage(imageName: ImageName, suffix = '.svg'): string {
  // tabbar图片使用本地
  if (tabbarImage.includes(imageName as (typeof tabbarImage)[number]))
    return `/static/icons/${imageName + suffix}`

  return (isHttpImage ? imageBaseUrl : '') + `/static/icons/${imageName + suffix}`
}
