import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import { Title, Link, FactBox, Tabs, Divider } from '@statisticsnorway/ssb-component-library'
import { Row, Col } from 'react-bootstrap'
import NumberFormat from 'react-number-format'

function StaticVisualization(props) {
  const [activeTab, changeTab] = useState('figure')
  const tabClicked = (e) => changeTab(e)

  function renderLongDescriptionAndSources() {
    return (
      <React.Fragment>
        {props.longDesc ? <p className="pt-4">{props.longDesc}</p> : null}
        {props.footnotes.length ?
          <ul className={`footnote${props.inFactPage ? '' : ' pl-0'}`}>
            {props.footnotes.map((footnote, index) =>
              <li key={`footnote-${index}`}>
                <sup>{index + 1}</sup>
                <span>{footnote}</span>
              </li>
            )}
          </ul> : null}

        {props.sources.length ?
          <p className="pt-2">
            {props.sources.map((source, index) =>
              <p key={`source-${index}`} className="sources">
                <Link className="mb-1" href={source.url}>{props.sourcesLabel}: {source.urlText}</Link>
              </p>)}
          </p> : null}
      </React.Fragment>
    )
  }

  function renderTabs() {
    if (props.tableData !== '') {
      return (
        <div>
          <Tabs
            activeOnInit="figure"
            onClick={tabClicked}
            items={[
              {
                title: 'Vis som figur',
                path: 'figure'
              },
              {
                title: 'Vis som tabell',
                path: 'table'
              }
            ]}
          />
          <Divider className="mb-4" />
        </div>
      )
    }
  }

  function createTable() {
    const tableData = props.tableData
    return (
      <table className="statistics">
        <thead>
          <tr>
            {createHeaderCell(tableData.table.thead.tr) }
          </tr>
        </thead>
        <tbody>
          {tableData.table.tbody.tr.map( (row, index) => {
            return (
              <tr key={index}>
                {createBodyCells(row)}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  function createHeaderCell(row) {
    return row.th.map((cellValue, i) => {
      return (
        <th key={i}>{trimValue(cellValue)}</th>
      )
    })
  }

  function createBodyCells(row) {
    return row.td.map((cellValue, i) => {
      if (i > 0) {
        return (
          <td key={i}>{formatNumber(cellValue)}</td>
        )
      } else {
        return (
          <th key={i}>{trimValue(cellValue)}</th>
        )
      }
    })
  }

  function formatNumber(value) {
    const language = props.language
    const decimalSeparator = (language === 'en') ? '.' : ','
    value = trimValue(value)
    if (value) {
      if (typeof value === 'number' || typeof value === 'string' && !isNaN(value)) {
        const decimals = value.toString().indexOf('.') > -1 ? value.toString().split('.')[1].length : 0
        return (
          <NumberFormat
            value={ Number(value) }
            displayType={'text'}
            thousandSeparator={' '}
            decimalSeparator={decimalSeparator}
            decimalScale={decimals}
            fixedDecimalScale={true}
          />
        )
      }
    }
    return value
  }

  function trimValue(value) {
    if (value && typeof value === 'string') {
      return value.trim()
    }
    return value
  }

  return (
    <section className="container part-static-visualization">
      <Row className="xp-part">
        <Col className="xp-region col-12">
          <Title size={2} className="mt-0">{props.title}</Title>
          {renderTabs()}
          {activeTab === 'figure' && (
            <div className="d-flex justify-content-center mb-5">
              <img alt={props.altText} src={props.imageSrc} />
            </div>
          )}

          {activeTab === 'table' && (
            <div className="d-flex justify-content-center mb-5">
              {createTable()}
            </div>
          )}

          <FactBox
            header={props.descriptionStaticVisualization}
            text={renderLongDescriptionAndSources()}
          />

        </Col>
      </Row>
    </section>

  )
}

StaticVisualization.propTypes = {
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  altText: PropTypes.string,
  longDesc: PropTypes.string,
  descriptionStaticVisualization: PropTypes.string,
  footnotes: PropTypes.array,
  sourcesLabel: PropTypes.string,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      urlText: PropTypes.string
    })
  ),
  inFactPage: PropTypes.bool,
  language: PropTypes.string,
  tableData: PropTypes.shape({
    table: {
      thead: {
        tr: {
          th: PropTypes.array
        }
      },
      tbody: PropTypes.arrayOf(
        PropTypes.shape({
          tr: PropTypes.arrayOf(
            PropTypes.shape({
              th: PropTypes.array,
              td: PropTypes.array
            })
          )
        })
      )
    }
  })
}

export default (props) => <StaticVisualization {...props} />
