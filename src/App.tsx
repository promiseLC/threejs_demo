import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { routes, RouterView } from './route';
import './App.css';
import { RouteConfig } from './route/types';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const location = useLocation();
  
  // 递归构建菜单项
  const buildMenuItems = (routes: RouteConfig[]): MenuProps['items'] => {
    return routes.map(route => ({
      key: route.path,
      label: route.component ? (
        <Link to={route.path}>{route.name}</Link>
      ) : route.name,
      children: route.children ? buildMenuItems(route.children) : undefined
    }));
  };

  const menuItems = buildMenuItems(routes);



  // 使用正则来提取location.pathname中第一个/到第二个/中间的值
  const path = location.pathname.match(/(\/[^\/]+)\/[^\/]+/)?.[1];
  

  return (
    <Layout >
      <Sider>
        <div className='logo' style={{fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '10px'}}> THREE </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={routes.map(route => route.path).filter(route => route.includes(path??''))}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} >
          <div style={{fontSize: '16px', fontWeight: 'bold'}}>THREE</div>
        </Header>
        <Content style={{ margin: '24px 16px',  background: '#fff', minHeight: 280 }}>
          <RouterView />
        </Content>
      </Layout>
    </Layout>
  );
};

// 包装 App 组件以使用 useLocation
const AppWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
