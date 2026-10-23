<template>
  <footer class="mt-10 border-t border-[#eceef1] bg-white">
    <div class="page-container py-8">
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="h-7 w-7 flex items-center justify-center rounded-2 bg-[#018d71] text-3.5 text-white font-bold"
            >
              C
            </span>
            <span class="text-4 text-[#15181b] font-bold">CNode 社区</span>
          </div>
          <p class="mt-2 max-w-100 text-3 text-[#7b8188] leading-relaxed">
            Node.js 中文技术社区，分享技术、讨论问题、寻找机会。本项目基于 CNode Next API 构建。
          </p>
        </div>

        <div class="flex gap-12">
          <div>
            <div class="mb-2 text-3 text-[#15181b] font-bold">社区</div>
            <div class="flex flex-col gap-1.5 text-3 text-[#7b8188]">
              <RouterLink class="hover:text-[#018d71]" to="/">话题广场</RouterLink>
              <RouterLink class="hover:text-[#018d71]" to="/jobs">招聘专区</RouterLink>
              <RouterLink class="hover:text-[#018d71]" to="/rank">社区榜单</RouterLink>
            </div>
          </div>
          <div>
            <div class="mb-2 text-3 text-[#15181b] font-bold">相关链接</div>
            <div class="flex flex-col gap-1.5 text-3 text-[#7b8188]">
              <a class="hover:text-[#018d71]" href="https://cnodejs.org" rel="noreferrer" target="_blank">
                CNode 官网
              </a>
              <a
                class="hover:text-[#018d71]"
                href="https://github.com/cnodejs"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                class="hover:text-[#018d71]"
                href="https://api.cnodejs.org"
                rel="noreferrer"
                target="_blank"
              >
                API 文档
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-6 border-t border-[#f2f4f6] pt-4 text-2.75 text-[#9aa0a6] flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
      >
        <span>© {{ new Date().getFullYear() }} CNode 社区 · 由社区驱动</span>
        <span>Vue 3 · Vite · Element Plus</span>
      </div>
    </div>
  </footer>
</template>
