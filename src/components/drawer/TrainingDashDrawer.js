import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Routes, Route, NavLink } from "react-router-dom";
// - Training Modules Components -----------------------------//
import Course_Video_Intro from "../coursedashboard/coursevideointro/CourseVideoIntro";
import Pre_Assesment_Test from "../coursedashboard/preassesment/PreAssesmentTest";
import Taining_Videos_Module from "../coursedashboard/trainingmodule/TainingVideosModule";
import ScrollUp from "../../ScrollUp";
import { Collapse, Tooltip } from "@mui/material";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Topic_Master from "../masters/topicmaster/TopicMaster";
import Module_Master from "../masters/modulemaster/ModuleMaster";
import Course_Master from "../masters/coursemaster/CourseMaster";
import AssesmentMasterMainPage from "../masters/assesmentmaster/AssesmentMasterMainPage";
import { MdModelTraining } from "react-icons/md";
import { RiMastercardLine } from "react-icons/ri";
import Assign_Training from "../masters/assigntraining/AssignTraining";
import RunTimeCourse from "../masters/runtimecoursescreen/components/runtimecourse/RunTimeCourse";

const data = [
  {
    id: 1,
    name: "Training Module",
    icon: <MdModelTraining size={27} color="#1e90ff" />,
    path: "/",
  },
  {
    id: 1,
    name: "Masters",
    icon: <RiMastercardLine size={27} color="#1e90ff" />,
    subMenus: [
      {
        id: 2,
        functionality: "RunTime Course",
        path: "/runtimecourse",
      },
      {
        id: 3,
        functionality: "Topic Master",
        path: "/topicmaster",
      },
      {
        id: 4,
        functionality: "Assesment Master",
        path: "/assesmentmaster",
      },
      {
        id: 5,
        functionality: "Module Master",
        path: "/modulemaster",
      },
      {
        id: 6,
        functionality: "Course Master",
        path: "/coursemaster",
      },
      {
        id: 7,
        functionality: "Assign Course Master",
        path: "/assigntraining",
      },
    ],
  },
];

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Training_Dash_Drawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openCollapseId, setOpenCollapseId] = React.useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    if (window.innerWidth < 768) {
      window.location.reload();
    }
    setOpenCollapseId([]);
  };

  const toggleCollapse = (id) => {
    let ids = [...openCollapseId];
    if (!ids.includes(id)) {
      ids.push(id);
      setOpenCollapseId(ids);
    } else {
      let modifiedIds = ids.filter((prev) => prev !== id);
      setOpenCollapseId(modifiedIds);
    }
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Training Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {data.map((text, i) => (
            <div key={text.id}>
              <Tooltip title={open ? "" : text.name} placement="right" arrow>
                <NavLink
                  to={text.path}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2,
                    }}
                    onClick={() => text.subMenus && toggleCollapse(text.id)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : "auto",
                        justifyContent: "center",
                        color: "#1F2933",
                      }}
                    >
                      <p>{text.icon}</p>
                    </ListItemIcon>
                    <ListItemText
                      primary={text.name}
                      sx={{ opacity: open ? 1 : 0, color: "#1F2933" }}
                    />
                    {text.subMenus && (
                      <IconButton
                        sx={{
                          ml: "auto",
                          display: open && text.subMenus ? "block" : "none",
                        }}
                      >
                        {text.subMenus &&
                          (openCollapseId.includes(text.id) ? (
                            <FaChevronUp size={14} />
                          ) : (
                            <FaChevronDown size={14} />
                          ))}
                      </IconButton>
                    )}
                  </ListItemButton>
                </NavLink>
              </Tooltip>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={openCollapseId.includes(text.id)}
              >
                <List component="div" disablePadding>
                  {text.subMenus &&
                    text.subMenus.map((subMenu) => (
                      <NavLink
                        to={subMenu.path}
                        key={subMenu.id}
                        disablePadding
                        sx={{ display: "block" }}
                      >
                        <ListItemButton sx={{ pl: 0, minHeight: 48 }}>
                          <ListItemIcon></ListItemIcon>
                          <ListItemText primary={subMenu.functionality} />
                        </ListItemButton>
                      </NavLink>
                    ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <ScrollUp />
        <Routes>
          <Route path="/" element={<Course_Video_Intro />} />
          <Route path="/preassesmenttext/:id" element={<Pre_Assesment_Test />}>
            <Route path="videos" element={<Taining_Videos_Module />} />
          </Route>
          <Route path="/topicmaster" element={<Topic_Master />} />
          <Route path="/modulemaster" element={<Module_Master />} />
          <Route
            path="/assesmentmaster"
            element={<AssesmentMasterMainPage />}
          />
          <Route path="/coursemaster" element={<Course_Master />} />
          <Route path="/assigntraining" element={<Assign_Training />} />
          <Route path="/runtimecourse" element={<RunTimeCourse />} />
        </Routes>
      </Box>
    </Box>
  );
}
