import React from 'react'
import { Button, Title, Link, LeadParagraph, Paragraph, Text } from '@statisticsnorway/ssb-component-library'
import PropTypes from 'prop-types'
import { Share2, Send, Smartphone, Eye, Download, ExternalLink } from 'react-feather'

const Employee = (props) => {
  const {
    title, email, position, phone, description, profileImages, myCV, projects, isResearcher, cristinId, area,
    emailPhrase,
    phonePhrase,
    positionPhrase,
    researchAreaPhrase,
    departmentPhrase,
    briefSummaryPhrase,
    projectsPhrase
  } = props

  const renderEmployeeDetails = () => {
    return (
      <div className="employee-details gx-0">
        <div>
          <Share2 size={30} transform='rotate(90)'/>
          <div>
            <div>{positionPhrase}</div>
            <span>{position}</span>
          </div>
        </div>
        <div>
          <Send size={30} />
          <div>
            <div>{emailPhrase}</div>
            <Link href={'mailto:' + email} linkType="profiled">{email}</Link>
          </div>
        </div>
        <div>
          <Smartphone size={30} />
          <div>
            <div>{phonePhrase}</div>
            <Link href=" " linkType="profiled">{phone}</Link>
          </div>
        </div>
        <div>
          <Eye size={30} />
          <div>
            <div>{isResearcher ? researchAreaPhrase : departmentPhrase}</div>
            <Link href={area.href} linkType="profiled">{area.title}</Link>
          </div>
        </div>
      </div>
    )
  }

  const renderProjects = () => {
    const projectList = projects.map((project, i) => {
      return (
        <li key={i}>
          <Link href={project.href} linkType="header">{project.title}</Link>
          <Paragraph>{project.description}</Paragraph>
        </li>
      )
    })
    return <ul>{projectList}</ul>
  }

  // const renderPublications = () => {
  //   const publication = mockData.publications[0]
  //   return <div>
  //     <Link href=" " linkType="profiled" icon={<ExternalLink size="20" />}>{publication.title}</Link>
  //     <Paragraph>{publication.author}</Paragraph>
  //     <Text small>{publication.description}</Text>
  //   </div>
  // }

  return (
    <section className="xp-part employee container p-0 mb-5">
      <div className="row">
        <div className="employee-head gx-0">
          <div className="employee-image col-6 col-md-3"><img alt={`profilbilder av ${title}`} src={props.profileImages[0]} /></div>
          <div className="col-6 col-md-6"><Title size="1">{title}</Title></div>
        </div>
      </div>
      <div className="row">
        { renderEmployeeDetails() }
      </div>
      <div className="row justify-content-center">
        <div className="employee-description col-12 col-md-6">
          <div>
            <h2>{briefSummaryPhrase}</h2>
            <LeadParagraph>{description}</LeadParagraph>
            {/* <div>
              <Button><Download size="18" /> &nbsp; Last ned CV (70 KB)</Button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="employee-projects col-md-6">
          <h2>{projectsPhrase}</h2>
          { renderProjects() }
        </div>
      </div>
      {/* <div className="row justify-content-center">
        <div className="employee-publications col-md-6">
          <h2>Publiseringer</h2>
        </div>
      </div> */}
    </section>
  )
}

Employee.propTypes = {
  title: PropTypes.string,
  email: PropTypes.string,
  position: PropTypes.string,
  phone: PropTypes.string,
  description: PropTypes.string,
  profileImages: PropTypes.array,
  myCV: PropTypes.string,
  projects: PropTypes.array,
  area: PropTypes.object,
  isResearcher: PropTypes.bool,
  cristinId: PropTypes.string | null,
  emailPhrase: PropTypes.string,
  phonePhrase: PropTypes.string,
  positionPhrase: PropTypes.string,
  researchAreaPhrase: PropTypes.string,
  departmentPhrase: PropTypes.string,
  briefSummaryPhrase: PropTypes.string,
  projectsPhrase: PropTypes.string
}

export default (props) => <Employee {...props} />