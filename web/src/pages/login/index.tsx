import { Input } from 'antd';
import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少为6位';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('登录成功', formData);
      alert('登录成功！');
    } catch (error: any) {
      console.error('操作失败:', error);
      alert(error?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecf0f3] p-4">
      <div
        className="flex w-full max-w-5xl min-h-[650px] bg-[#ecf0f3] rounded-3xl overflow-hidden"
        style={{ boxShadow: '10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9' }}
      >
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-16 py-12 ">
          <div className="w-full max-w-md">
            <h2
              className="text-center mb-16"
              style={{
                fontSize: '34px',
                fontWeight: 700,
                lineHeight: 3,
                color: '#181818'
              }}
            >
              Welcome Back !
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="neumorphism-input"
                  style={{
                    height: '40px',
                    paddingLeft: '24px',
                    fontSize: '13px',
                    letterSpacing: '0.15px',
                    borderRadius: '8px'
                  }}
                  placeholder="Email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <Input.Password
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="neumorphism-input"
                  style={{
                    height: '40px',
                    fontSize: '13px',
                    letterSpacing: '0.15px',
                    borderRadius: '8px'
                  }}
                  placeholder="Password"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-base uppercase tracking-wider hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Sign Up Section */}
        <div className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center px-16 py-12 text-white relative overflow-hidden">
          {/* Wave SVG Decoration */}
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.3"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>

          <div className="relative z-10 text-center max-w-lg px-8">
            {/* Logo Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6">LZ Monitor</h1>
            <h2 className="text-center mb-8 text-2xl font-semibold">前端监控平台</h2>

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">实时错误监控</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    自动捕获并上报前端错误，快速定位问题根源
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">性能分析</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    全方位的性能指标监控，优化用户体验
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">用户行为追踪</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    记录用户操作轨迹，还原问题现场
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for antd Input */}
      <style>{`
        /* 普通输入框默认样式 */
        .neumorphism-input.ant-input {
          background-color: #ecf0f3 !important;
          border: none !important;
          box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9 !important;
          transition: all 0.25s ease;
        }
        
        /* 普通输入框聚焦样式 */
        .neumorphism-input.ant-input:focus,
        .neumorphism-input.ant-input-focused {
          box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9 !important;
        }
        
        /* 密码输入框容器（ant-input-affix-wrapper） */
        .neumorphism-input.ant-input-affix-wrapper {
          background-color: #ecf0f3 !important;
          border: none !important;
          padding-left: 24px !important;
          box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9 !important;
          transition: all 0.25s ease;
        }
        
        /* 密码输入框容器聚焦样式 */
        .neumorphism-input.ant-input-affix-wrapper:focus,
        .neumorphism-input.ant-input-affix-wrapper-focused {
          box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9 !important;
        }
        
        /* 密码输入框内部的 input */
        .neumorphism-input.ant-input-affix-wrapper .ant-input {
          background-color: #ecf0f3 !important;
          padding-left: 0 !important;
        }
        
        /* 密码输入框的眼睛图标 */
        .neumorphism-input .ant-input-suffix {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}
