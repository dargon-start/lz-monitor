import { Button, Card, Space, message } from 'antd';
import { memo, useState } from 'react';

/**
 * 错误测试组件
 * 用于测试各种类型的错误监控
 */
export default memo(function ErrorTest() {
  const [, setError] = useState<any>();

  // 1. JavaScript 运行时错误
  const triggerJsError = () => {
    const obj: any = null;
    console.log(obj.property); // 会触发 TypeError
  };

  // 2. Promise 未捕获错误
  const triggerPromiseError = () => {
    Promise.reject(new Error('未捕获的 Promise 错误'));
  };

  // 3. 异步错误
  const triggerAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('异步函数中的错误');
  };

  // 4. React 错误边界错误
  const triggerReactError = () => {
    setError(() => {
      throw new Error('React 组件渲染错误');
    });
  };

  // 5. 资源加载错误
  const triggerResourceError = () => {
    const img = new Image();
    img.src = 'https://example.com/non-existent-image.jpg';
    document.body.appendChild(img);
    setTimeout(() => document.body.removeChild(img), 1000);
    message.info('已触发图片加载错误');
  };

  // 6. 网络请求错误 (404)
  const triggerNetworkError = async () => {
    try {
      await fetch('https://httpstat.us/404');
    } catch (error) {
      console.error('网络请求失败', error);
    }
  };

  // 7. 网络请求错误 (500)
  const triggerServerError = async () => {
    try {
      await fetch('https://httpstat.us/500');
    } catch (error) {
      console.error('服务器错误', error);
    }
  };

  // 8. 跨域错误
  const triggerCorsError = async () => {
    try {
      await fetch('https://example.com/api/test', { mode: 'cors' });
    } catch (error) {
      console.error('跨域错误', error);
    }
  };

  // 9. 超时错误
  const triggerTimeoutError = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100);

    try {
      await fetch('https://httpstat.us/200?sleep=5000', {
        signal: controller.signal
      });
    } catch (error) {
      console.error('请求超时', error);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // 10. 类型错误
  const triggerTypeError = () => {
    // @ts-ignore
    const num: number = 'string';
    console.log(num.toFixed(2));
  };

  // 11. 引用错误
  const triggerReferenceError = () => {
    // @ts-ignore
    console.log(undefinedVariable);
  };

  // 12. 语法错误（通过 eval）
  const triggerSyntaxError = () => {
    try {
      eval('const a = {');
    } catch (error) {
      throw new Error('语法错误: ' + (error as Error).message);
    }
  };

  // 13. 自定义错误
  const triggerCustomError = () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    throw new CustomError('这是一个自定义错误');
  };

  // 14. 控制台错误
  const triggerConsoleError = () => {
    console.error('这是一个控制台错误消息', {
      code: 'ERR_001',
      details: '详细错误信息'
    });
    message.info('已输出控制台错误');
  };

  // 15. 栈溢出错误
  const triggerStackOverflow = () => {
    const recursiveFunction = (): any => {
      return recursiveFunction();
    };
    recursiveFunction();
  };

  // 16. 内存泄漏模拟
  const triggerMemoryLeak = () => {
    const largeArray: number[] = [];
    for (let i = 0; i < 10000000; i++) {
      largeArray.push(i);
    }
    message.info('已创建大数组，可能导致内存压力');
  };

  // 17. XHR 错误
  const triggerXhrError = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://httpstat.us/404');
    xhr.send();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">错误监控测试面板</h2>

      <Space direction="vertical" size="large" className="w-full">
        {/* JavaScript 错误 */}
        <Card title="JavaScript 错误" size="small">
          <Space wrap>
            <Button onClick={triggerJsError} danger>
              触发 JS 运行时错误
            </Button>
            <Button onClick={triggerTypeError} danger>
              触发类型错误
            </Button>
            <Button onClick={triggerReferenceError} danger>
              触发引用错误
            </Button>
            <Button onClick={triggerSyntaxError} danger>
              触发语法错误
            </Button>
          </Space>
        </Card>

        {/* Promise 错误 */}
        <Card title="Promise 错误" size="small">
          <Space wrap>
            <Button onClick={triggerPromiseError} danger>
              未捕获 Promise 错误
            </Button>
            <Button onClick={() => triggerAsyncError().catch(console.error)} danger>
              异步函数错误
            </Button>
          </Space>
        </Card>

        {/* React 错误 */}
        <Card title="React 错误" size="small">
          <Button onClick={triggerReactError} danger>
            触发 React 渲染错误
          </Button>
        </Card>

        {/* 资源加载错误 */}
        <Card title="资源加载错误" size="small">
          <Button onClick={triggerResourceError} danger>
            触发图片加载错误
          </Button>
        </Card>

        {/* 网络请求错误 */}
        <Card title="网络请求错误" size="small">
          <Space wrap>
            <Button onClick={triggerNetworkError} danger>
              404 错误
            </Button>
            <Button onClick={triggerServerError} danger>
              500 错误
            </Button>
            <Button onClick={triggerCorsError} danger>
              跨域错误
            </Button>
            <Button onClick={triggerTimeoutError} danger>
              超时错误
            </Button>
            <Button onClick={triggerXhrError} danger>
              XHR 404 错误
            </Button>
          </Space>
        </Card>

        {/* 性能相关 */}
        <Card title="性能/内存问题" size="small">
          <Space wrap>
            <Button onClick={triggerStackOverflow} danger>
              栈溢出错误
            </Button>
            <Button onClick={triggerMemoryLeak} type="primary">
              模拟内存压力
            </Button>
          </Space>
        </Card>

        {/* 其他错误 */}
        <Card title="其他错误" size="small">
          <Space wrap>
            <Button onClick={triggerCustomError} danger>
              自定义错误
            </Button>
            <Button onClick={triggerConsoleError} type="default">
              控制台错误
            </Button>
          </Space>
        </Card>
      </Space>

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <p className="text-sm text-gray-600">
          💡 提示：点击按钮后，查看浏览器控制台和监控平台，确认错误是否被正确上报。
        </p>
      </div>
    </div>
  );
});
