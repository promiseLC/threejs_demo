import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { RouteConfig } from './types';
import { ComponentType } from 'react';

// 自动导入 views 目录下的所有组件
const views = import.meta.glob('../view/**/index.tsx');

// 处理路由配置
export const routes: RouteConfig[] = [];

// 处理路径生成路由配置
Object.entries(views).forEach(([path, component]) => {
  const pathParts = path.replace('../view/', '').replace('/index.tsx', '').split('/');
  let currentLevel = routes;

  pathParts.forEach((part, index) => {
    const isLast = index === pathParts.length - 1;
    const existingRoute = currentLevel.find(r => r.key === part);
    const routePath = `/${pathParts.slice(0, index + 1).join('/')}`.toLowerCase();
    
    if (!existingRoute) {
      const newRoute: RouteConfig = {
        key: part,
        path: routePath,
        name: part
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        children: !isLast ? [] : undefined,
        component: isLast ? lazy(() => component() as Promise<{ default: ComponentType }>) : undefined
      };
      
      currentLevel.push(newRoute);
      if (!isLast) {
        currentLevel = newRoute.children!;
      }
    } else {
      currentLevel = existingRoute.children!;
    }
  });
});

// 递归生成路由
const generateRoutes = (routes: RouteConfig[]): JSX.Element[] => {
  return routes.map(route => (
    route.component ? (
      <Route 
        key={route.path}
        path={route.path}
        element={<route.component />}
      />
    ) : (
      route.children && route.children.map(child => generateRoutes([child])) 
    )
  )) as JSX.Element[];
};

// 路由组件
export const RouterView: React.FC = () => {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={routes[0]?.path || '/'} replace />} 
        />
        {generateRoutes(routes)}
        <Route 
          path="*" 
          element={<Navigate to={routes[0]?.path || '/'} replace />} 
        />
      </Routes>
    </Suspense>
  );
};
