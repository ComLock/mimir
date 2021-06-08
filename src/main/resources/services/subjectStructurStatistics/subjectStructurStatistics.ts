import { Response } from 'enonic-types/controller'
import { MainSubject,
  SubSubject,
  Title,
  StatisticItem } from '../../lib/ssb/utils/subjectUtils'
const {
  getSubjectStructur
} = __non_webpack_require__('/lib/ssb/utils/subjectUtils')

function get(): Response {
  const mainSubjects: Array<MainSubject> = getSubjectStructur('no')

  const xml: string =
`<?xml version="1.0" encoding="utf-8"?>
  <result>
    <emnestruktur>
        ${[...mainSubjects].map((m: MainSubject) =>
    `<hovedemne emnekode="${m.subjectCode}">${getXmlTitle(m.titles)}${m.subSubjects.map((s: SubSubject) =>
      `<delemne emnekode="${s.subjectCode}">${getXmlTitle(s.titles)} ${s.statistics.map((stat: StatisticItem) =>
        `<Statistikk kortnavn="${stat.shortName}" isPrimaerPlassering="${stat.isPrimaryLocated}">${getXmlTitle(stat.titles)}</Statistikk>`).join('')}        
        </delemne>`).join('')}
        </hovedemne>`).join('')}
    </emnestruktur>
  </result>`

  return {
    body: xml,
    contentType: 'text/xml'
  }
}
exports.get = get

function getXmlTitle(titles: Array<Title>): string {
  return `<titler>${titles.map((st: Title) => `<tittel sprak="${st.language}">${st.title}</tittel>`).join('')}</titler>`
}
