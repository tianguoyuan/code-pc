import { readdir, rm, stat } from 'fs/promises'
import gulp from 'gulp'
import path from 'path'

const iconsDirs = [
  path.resolve(process.cwd(), 'dist/build/mp-weixin/static/icons'),
  path.resolve(process.cwd(), 'dist/dev/mp-weixin/static/icons'),
]

async function cleanMpIcons() {
  await Promise.all(
    iconsDirs.map(async (dir) => {
      try {
        await stat(dir)
      } catch {
        return
      }
      const files = await readdir(dir)
      await Promise.all(
        files
          // 会保留 tabbar 开头的文件， 删除其他文件
          .filter((file) => !file.startsWith('tabbar'))
          .map((file) => rm(path.join(dir, file), { force: true, recursive: true })),
      )
    }),
  )
}

// 兼容 gulp CLI：`gulp cleanMpIcons`
gulp.task('default', cleanMpIcons)

export default cleanMpIcons
