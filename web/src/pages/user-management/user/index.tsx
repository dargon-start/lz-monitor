import { memo, useEffect, useState } from 'react'
import { Table, Tag } from 'antd'
import { getOrgList } from '@/api/user-management'
import type { Organization } from '@/api/user-management/org.type'
interface dataType extends Organization {
  key: React.ReactNode
}

interface UserProps {}

export default memo(function index({}: UserProps) {
  const [data, setData] = useState<dataType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await getOrgList({}).finally(() => {
        setLoading(false)
      })
      console.log(res)
      const data = res.map(item => ({
        ...item,
        key: item.id
      }))
      setData(data)
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        return <Tag color={status === 'enable' ? 'success' : 'error'}>{status}</Tag>
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc'
    }
  ]

  return (
    <>
      <div className='text-primary text-base hover:text-primary-hover'>用户列表</div>
      <Table<dataType> columns={columns} dataSource={data} loading={loading} />
    </>
  )
})
