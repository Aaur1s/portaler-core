import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import styles from './styles.module.scss'
import useGetUserInfo from '../common/hooks/useGetUserInfo'

const TopWalkers = () => {
  const raw_data = useGetUserInfo()
  const data: any[] = []
  raw_data
    ? raw_data?.map((i) => {
        data[data.length] = {
          number: data.length + 1,
          name: i.discord_name + '#' + i.discord_discriminator,
          points: i.portals_created,
        }
      })
    : (data[0] = {
        number: 0,
        name: 'null',
        points: 0,
      })
  const columns = [
    {
      dataField: 'number',
      text: '№',
      headerStyle: { width: '70px', textAlign: 'center' },
      style: { textAlign: 'center' },
      formatter: (cell: any, row: any, rowIndex: number) => rowIndex + 1,
    },
    {
      dataField: 'name',
      text: 'Name',
      headerStyle: { textAlign: 'center', width: '300px' },
      style: { textAlign: 'center' },
    },
    {
      dataField: 'points',
      text: 'Points',
      headerStyle: { width: '100px', textAlign: 'center' },
      style: { textAlign: 'center' },
      sort: true,
    },
  ]

  return (
    <div className={styles.table}>
      <h3>Top of mappers (1 connection = 1 point):</h3>
      <BootstrapTable
        keyField="number"
        data={data ? data : [0]}
        columns={columns}
        sort={{ dataField: 'points', order: 'desc' }}
      />
    </div>
  )
}

export default TopWalkers
