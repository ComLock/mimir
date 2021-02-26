import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { WebSocketContext } from '../../utils/websocket/WebsocketProvider'
import { Button, Modal } from 'react-bootstrap'
import { requestStatisticsJobLog } from './actions'
import moment from 'moment/min/moment-with-locales'
import { groupBy } from 'ramda'
import { StatisticsLogJob } from './StatisticsLogJob'
import { selectStatisticsLogDataLoaded, selectStatistic } from './selectors'

export function StatisticsLog(props) {
  const {
    statisticId
  } = props

  const io = useContext(WebSocketContext)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [firstOpen, setFirstOpen] = useState(true)
  const statistic = useSelector(selectStatistic(statisticId))
  const logsLoaded = useSelector(selectStatisticsLogDataLoaded(statistic.id))
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const openEventlog = () => {
    if (firstOpen) {
      requestStatisticsJobLog(dispatch, io, statistic.id)
      setFirstOpen(false)
    }
    setShow(handleShow)
  }


  function renderLogData() {
    if (!statistic) {
      setStatistic(stats)
    }

    if (statistic && statistic.logData && statistic.logData.length > 0) {
      const log = statistic.logData[0]
      const groupedDataSourceLogs = groupBy((log) => {
        return log.status
      })(log.result)
      return (
        <React.Fragment>
          <span className="d-sm-flex justify-content-center text-center small haveList" onClick={() => openEventlog()}>
            {log.message} - {moment(log.completionTime ? log.completionTime : log.startTime).locale('nb').format('DD.MM.YYYY HH.mm')}
            <br/>
            {log.user ? log.user.displayName : ''}
            <br/>
            {Object.entries(groupedDataSourceLogs).map(([status, dataSourceLogGroup]) => renderDataSourceLogGroup(log, status, dataSourceLogGroup))}
          </span>
          {show ? <ModalContent/> : null}
        </React.Fragment>
      )
    }
    return <span className="d-sm-flex justify-content-center text-center small">Ingen logger</span>
  }

  function renderDataSourceLogGroup(log, status, dataSourceLogGroup) {
    const tbmls = dataSourceLogGroup.map((datasource) => {
      const relatedTable = statistic.relatedTables.find((r) => r.queryId === datasource.id)
      return relatedTable ? relatedTable.tbmlId : ''
    }).join(', ')
    return (
      <React.Fragment key={`${log.id}_${status}`}>
        {status} - {tbmls} <br/>
      </React.Fragment>
    )
  }

  function renderModalBody() {
    if (logsLoaded) {
      return (
        statistic.logData.map((log, index) => {
          return (
            <StatisticsLogJob key={index} statisticId={statistic.id} jobId={statistic.logData[index].id} />
          )
        })
      )
    }

    return (
      <span className="spinner-border spinner-border" />
    )
  }


  const ModalContent = () => {
    return (
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {statistic.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Logg detaljer</h3>
          {renderModalBody()}
          {/* <StatisticsLogJob selectStatistic={getStatisticSelector} /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Lukk</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    renderLogData()
  )
}

StatisticsLog.propTypes = {
  statisticId: PropTypes.string
}
