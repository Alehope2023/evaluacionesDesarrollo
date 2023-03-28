import { useState, createRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'
import { Switch, Route, Redirect } from 'react-router-dom'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { makeStyles } from '@material-ui/core'
import AdminNavbar from 'components/Navbars/AdminNavbar'
import Footer from 'components/Footer/Footer'
import Sidebar from 'components/Sidebar/Sidebar'
import routes from 'routes/routes'
import role from 'config/roles/roles'
import { refreshToken } from 'redux/actions/userActions'
import styles from './styles/adminStyle'

var ps

const useStyles = makeStyles(styles)

const DashboardLayout = ({ ...rest }) => {
  const classes = useStyles()
  const history = useHistory()
  const mainPanel = createRef()
  const dispatch = useDispatch()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [miniActive, setMiniActive] = useState(false)
  const [logo, setLogo] = useState(require('assets/img/logo-agencia-actividades-corto.jpg').default)

  const { userInfo } = useSelector((state) => state.userLogin)

  // useEffect(() => {
  //   if (!userInfo) {
  //     history.push('/auth/login')
  //   }
  // }, [userInfo, history])

  useEffect(() => {
    //dispatch(refreshToken())
  }, [])

  const mainPanelClasses =
    classes.mainPanel +
    ' ' +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]: navigator.platform.indexOf('Win') > -1,
    })

  useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
      document.body.style.overflow = 'hidden'
    }
    window.addEventListener('resize', resizeFunction)

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy()
      }
      window.removeEventListener('resize', resizeFunction)
    }
  })
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const getActiveRoute = (routes) => {
    let activeRoute = 'Agencia de Actividades'
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else {
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name
        }
      }
    }
    return activeRoute
  }
  const getRoutes = (routes) => {
    let filteredRoutes = getRoutesByRole(routes)
    return filteredRoutes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views)
      }
      if (prop.layout === '/admin') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />
      } else {
        return null
      }
    })
  }
  const sidebarMinimize = () => {
    setMiniActive(!miniActive)
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false)
    }
  }

  const getFilteredRoutes = (permiso, routes) => {
    switch (permiso) {
      case role.SUPER_ROLE:
        const superAdminArray = routes.filter((route) => route.role.includes(role.SUPER_ROLE))
        superAdminArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return superAdminArray
      case role.ADMIN_ROLE:
        const adminArray = routes.filter((route) => route.role.includes(role.ADMIN_ROLE))
        adminArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return adminArray
      case role.GESTOR_DE_PERFILES_ROLE:
        const gestorProfileArray = routes.filter((route) => route.role.includes(role.GESTOR_DE_PERFILES_ROLE))
        gestorProfileArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return gestorProfileArray
      case role.VALIDADOR_ROLE:
        const validatorArray = routes.filter((route) => route.role.includes(role.VALIDADOR_ROLE))
        validatorArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return validatorArray
      case role.GESTOR_DE_DATOS_ROLE:
        const gestorArray = routes.filter((route) => route.role.includes(role.GESTOR_DE_DATOS_ROLE))
        gestorArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return gestorArray
      case role.RESPONSABLE_ROLE:
        const responsibleArray = routes.filter((route) => route.role.includes(role.RESPONSABLE_ROLE))
        responsibleArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return responsibleArray
      case role.USUARIO_ROLE:
        const userArray = routes.filter((route) => route.role.includes(role.USUARIO_ROLE))
        userArray.forEach((item) => {
          if (item.collapse) {
            item.views = getFilteredRoutes(permiso, item.views)
          }
        })
        return userArray
      default:
        return []
    }
    // if (userInfo?.permiso.includes(role.SUPER_ROLE)) {
    //   const superAdminArray = routes.filter((route) => route.role.includes(role.SUPER_ROLE))
    //   superAdminArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return superAdminArray
    // }
    // if (userInfo?.permiso.includes(role.ADMIN_ROLE)) {
    //   const adminArray = routes.filter((route) => route.role.includes(role.ADMIN_ROLE))
    //   adminArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return adminArray
    // }
    // if (userInfo?.permiso.includes(role.GESTOR_DE_PERFILES_ROLE)) {
    //   const gestorArray = routes.filter((route) => route.role.includes(role.GESTOR_DE_PERFILES_ROLE))
    //   gestorArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return gestorArray
    // }
    // if (userInfo?.permiso.includes(role.VALIDADOR_ROLE)) {
    //   const validatorArray = routes.filter((route) => route.role.includes(role.VALIDADOR_ROLE))
    //   validatorArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return validatorArray
    // }
    // if (userInfo?.permiso.includes(role.GESTOR_DE_DATOS_ROLE)) {
    //   const gestorArray = routes.filter((route) => route.role.includes(role.GESTOR_DE_DATOS_ROLE))
    //   gestorArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return gestorArray
    // }
    // if (userInfo?.permiso.includes(role.RESPONSABLE_ROLE)) {
    //   const responsibleArray = routes.filter((route) => route.role.includes(role.RESPONSABLE_ROLE))
    //   responsibleArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return responsibleArray
    // }
    // if (userInfo?.permiso.includes(role.USUARIO_ROLE)) {
    //   const userArray = routes.filter((route) => route.role.includes(role.USUARIO_ROLE))
    //   userArray.forEach((item) => {
    //     if (item.collapse) {
    //       item.views = getFilteredRoutes(item.views)
    //     }
    //   })
    //   return userArray
    // }
    // return []
  }

  const getRoutesByRole = (routes) => {
    let routesArray = []
    userInfo.permiso.forEach((permiso) => {
      let array = getFilteredRoutes(permiso, routes)

      array.forEach((item) => {
        // let routeExists = routesArray.find((route) => route.path === item.path)
        // console.log(routeExists)
        // if (!routeExists) {
        //   routesArray.push(item)
        // }
      })

      routesArray = routesArray.concat(array)
    })

    return routesArray
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={getRoutesByRole(routes)}
        logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color='white'
        bgColor='white'
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from='/admin' to='/admin/user-page' />
            </Switch>
          </div>
        </div>
        <Footer fluid />
      </div>
    </div>
  )
}

export default DashboardLayout
