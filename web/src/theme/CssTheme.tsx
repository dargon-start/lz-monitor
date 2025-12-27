import { theme } from 'antd';
import { useSettings } from '@/store';
import { ThemeMode } from '#/enum';

const { useToken } = theme;
export default function CssTheme() {
  let { token } = useToken();
  console.log(token, 'token');

  const { themeMode } = useSettings();
  const isDark = themeMode === ThemeMode.Dark;

  const globalVars = `html {
    --ant-color-primary: ${token.colorPrimary};
    --ant-color-primary-hover: ${token.colorPrimaryHover};
    --ant-color-border: ${token.colorBorder};
    --ant-color-primary-bg: ${token.colorPrimaryBg};
    --ant-color-primary-bg-hover: ${token.colorPrimaryBgHover};
    --ant-color-primary-text: ${token.colorPrimaryText};
    --neumorphism-bg: ${isDark ? '#1a1a1a' : '#ecf0f3'};
    --neumorphism-shadow-dark: ${isDark ? '#0d0d0d' : '#d1d9e6'};
    --neumorphism-shadow-light: ${isDark ? '#262626' : '#f9f9f9'};
  }`;
  return <style>{globalVars}</style>;
}
