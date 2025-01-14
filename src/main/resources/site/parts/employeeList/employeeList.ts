import { type Content, query, type QueryResponse, get as getContentByKey } from '/lib/xp/content'
import type { Employee, Page } from '../../content-types'
import type { Default as DefaultPageConfig } from '../../pages/default'
import { getContent, Component, getComponent, pageUrl } from '/lib/xp/portal'
import { type RenderResponse, render } from '/lib/enonic/react4xp'
import type { EmployeeList as EmployeeListPartConfig } from '.'

const { renderError } = __non_webpack_require__('/lib/ssb/error/error')

export function get(req: XP.Request): RenderResponse | XP.Response {
  try {
    return renderPart(req)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

export function preview(req: XP.Request): RenderResponse {
  return renderPart(req)
}

function renderPart(req: XP.Request): RenderResponse {
  const content: Content<Page, object> = getContent()
  const part: Component<EmployeeListPartConfig> = getComponent()

  const queryResults: QueryResponse<Employee, object> = query({
    count: 500,
    contentTypes: [`${app.name}:employee`],
    query: `_path LIKE "/content${content._path}/*"`,
    sort: 'data.surname ASC',
  })

  const preparedResults: Array<IPreparedEmployee> = prepareEmployees(queryResults.hits)
  const alphabeticalEmployeesList: Array<IEmployeeMap> = createAlphabeticalEmployeesList(preparedResults)

  const props: IPartProps = {
    employees: alphabeticalEmployeesList,
    total: queryResults.total,
    pageTitle: content.displayName,
    pageDescription: part.config.ingress || '',
  }

  return render('site/parts/employeeList/employeeList', props, req)
}

function prepareEmployees(results: readonly Content<Employee>[]) {
  return results.map((result) => {
    const areaContent: Content<DefaultPageConfig> | null = result.data.area
      ? getContentByKey({
          key: result.data.area,
        })
      : null

    const area: Area | null = areaContent
      ? {
          title: areaContent.displayName,
          href: pageUrl({ path: areaContent._path }),
        }
      : null

    return {
      surname: result.data.surname || '',
      name: result.data.name || '',
      position: result.data.position || '',
      path: pageUrl({
        id: result._id,
      }),
      phone: result.data.phone || '',
      email: result.data.email || '',
      area: area || '',
    }
  })
}

function createAlphabeticalEmployeesList(preparedResults: IPreparedEmployee[]): Array<IEmployeeMap> {
  const data: IObjectKeys = preparedResults.reduce((result: IObjectKeys, employee: IPreparedEmployee) => {
    const alphabet: string = employee.surname[0].toUpperCase()
    if (!result[alphabet]) {
      result[alphabet] = {
        alphabet,
        record: [employee],
      }
    } else {
      result[alphabet].record.push(employee)
    }
    return result
  }, {})

  const result: Array<IEmployeeMap> = Object.keys(data).map((key) => data[key])
  return result
}

interface IPartProps {
  employees: IEmployeeMap[]
  total: number
  pageTitle: string
  pageDescription: string
}

interface IPreparedEmployee {
  surname: string
  name: string
  position: string
  path: string
  phone: string
  email: string
  area: string | Area
}

interface Area {
  href: string
  title: string
}

interface IObjectKeys {
  [key: string]: IEmployeeMap
}

interface IEmployeeMap {
  alphabet: string
  record: IPreparedEmployee[]
}
