import { useEffect, useState } from 'react';
import { Alert, Button, Card, Input, message, Space, Spin, Tag } from 'antd';
import { RobotOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { analyzeError, getErrorSolution, saveErrorSolution } from '@/api/error-report';

const { TextArea } = Input;

interface ErrorSolutionPanelProps {
  errorId: number;
  errorHash?: string;
}

export function ErrorSolutionPanel({ errorId }: ErrorSolutionPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [solutionText, setSolutionText] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['errorSolution', errorId],
    queryFn: () => getErrorSolution(errorId),
    enabled: !!errorId,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeError(errorId),
    onSuccess: () => {
      message.success('GPT分析完成');
      refetch();
    },
    onError: (err: any) => message.error(`分析失败: ${err.message || err}`),
  });

  const saveMutation = useMutation({
    mutationFn: (solution: string) => saveErrorSolution(errorId, solution),
    onSuccess: () => {
      message.success('解决方案已保存');
      setIsEditing(false);
      refetch();
    },
    onError: (err: any) => message.error(`保存失败: ${err.message || err}`),
  });

  useEffect(() => {
    if (data?.solution) setSolutionText(data.solution);
  }, [data]);

  return (
    <div className="space-y-4">
      <Space>
        <Button
          type="primary"
          icon={<RobotOutlined />}
          onClick={() => analyzeMutation.mutate()}
          loading={analyzeMutation.isPending}
        >
          GPT分析错误
        </Button>
        {data?.solution && (
          <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} disabled={isEditing}>
            编辑解决方案
          </Button>
        )}
      </Space>

      {isLoading && (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      )}

      {!isLoading && data && (
        <>
          {data.gptAnalysis && (
            <Alert
              message="GPT分析结果"
              type="info"
              description={
                <div className="mt-2">
                  <div>
                    <strong>错误原因：</strong>
                    {data.gptAnalysis.cause}
                  </div>
                  <div className="mt-2">
                    <strong>严重程度：</strong>
                    <Tag color={
                      data.gptAnalysis.severity === 'critical' ? 'red' :
                      data.gptAnalysis.severity === 'high' ? 'orange' : 'default'
                    }>
                      {data.gptAnalysis.severity}
                    </Tag>
                  </div>
                  <div className="mt-2">
                    <strong>详细分析：</strong>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      {data.gptAnalysis.analysis}
                    </div>
                  </div>
                </div>
              }
              className="mb-4"
            />
          )}

          <Card
            title={<span>解决方案 {data.isManual ? <Tag color="blue">手动添加</Tag> : <Tag color="green">GPT生成</Tag>}</span>}
            extra={isEditing && (
              <Button type="primary" icon={<SaveOutlined />} loading={saveMutation.isPending} onClick={() => saveMutation.mutate(solutionText)}>
                保存
              </Button>
            )}
          >
            {isEditing ? (
              <TextArea rows={10} value={solutionText} onChange={(e) => setSolutionText(e.target.value)} placeholder="请输入解决方案..." />
            ) : (
              <div className="whitespace-pre-wrap">{data.solution || '暂无解决方案'}</div>
            )}
          </Card>

          {data.updatedAt && (
            <div className="text-sm text-gray-500">最后更新：{new Date(data.updatedAt).toLocaleString()}</div>
          )}
        </>
      )}

      {!isLoading && !data?.solution && (
        <Card>
          <div className="text-center py-8 text-gray-400">
            <p>暂无解决方案</p>
            <p className="text-sm mt-2">点击“GPT分析错误”获取AI生成的解决方案，或编辑自定义方案。</p>
          </div>
        </Card>
      )}
    </div>
  );
}


