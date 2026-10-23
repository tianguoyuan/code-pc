import type { GenerateServiceProps } from 'openapi-ts-request'

export default [
  {
    isGenJavaScript: false,
    isGenReactQuery: true,
    reactQueryMode: 'vue',
    requestLibPath: `import request from '@/utils/request';\n import { CustomRequestOptions } from '@/interceptors/request';`,
    requestOptionsType: 'CustomRequestOptions',
    schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
    serversPath: './src/service/app',
  },
] as GenerateServiceProps[]
