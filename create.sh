#!/bin/bash

BASE="src/interfaces/SideBar"

echo "🚀 Creando módulo SideBar..."

# Crear carpetas
mkdir -p $BASE/{controllers,models,views,hooks,context,components}

# =========================
# MODELS
# =========================
cat > $BASE/models/SideBar.model.ts << 'EOF'
export interface SideBarItem {
  label: string;
  path?: string;
  icon?: JSX.Element;
  children?: SideBarItem[];
}
EOF

# =========================
# CONTROLLER
# =========================
cat > $BASE/controllers/SideBar.controller.ts << 'EOF'
export class SideBarController {
  toggleSection(
    current: Record<string, boolean>,
    label: string
  ): Record<string, boolean> {
    return {
      ...current,
      [label]: !current[label],
    };
  }
}
EOF

# =========================
# HOOK
# =========================
cat > $BASE/hooks/useSideBar.hook.ts << 'EOF'
import { useState } from "react";
import { SideBarController } from "../controllers/SideBar.controller";

export const useSideBar = () => {
  const controller = new SideBarController();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (label: string) => {
    setOpen(prev => controller.toggleSection(prev, label));
  };

  return {
    open,
    toggle,
  };
};
EOF

# =========================
# CONTEXT
# =========================
cat > $BASE/context/SideBar.context.tsx << 'EOF'
import { createContext, useContext } from "react";

interface SideBarContextType {
  // expandible para roles / permisos
}

const SideBarContext = createContext<SideBarContextType | null>(null);

export const useSideBarContext = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("SideBarContext not found");
  }
  return context;
};

export default SideBarContext;
EOF

# =========================
# COMPONENT (Item)
# =========================
cat > $BASE/components/SideBarItem.cmp.tsx << 'EOF'
import { FC } from "react";
import {
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface Props {
  label: string;
  onClick?: () => void;
  selected?: boolean;
}

export const SideBarItem: FC<Props> = ({
  label,
  onClick,
  selected = false,
}) => {
  return (
    <ListItemButton selected={selected} onClick={onClick}>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};
EOF

# =========================
# VIEW
# =========================
cat > $BASE/views/SideBar.view.tsx << 'EOF'
import { FC } from "react";
import {
  Drawer,
  List,
  Collapse,
  Toolbar,
  Typography,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useSideBar } from "../hooks/useSideBar.hook";
import { SideBarItem } from "../components/SideBarItem.cmp";
import { SideBarItem as SideBarItemType } from "../models/SideBar.model";

const drawerWidth = 260;

const menu: SideBarItemType[] = [
  {
    label: "Operaciones",
    children: [
      { label: "Asignación de Proyectos" },
      { label: "Visualizar Proyectos" },
    ],
  },
  {
    label: "Análisis",
    children: [
      { label: "Dashboard EVM" },
      { label: "Dashboard Horas" },
    ],
  },
  {
    label: "Reportería",
    children: [{ label: "Reportes" }],
  },
  {
    label: "Administración",
    children: [{ label: "Alta de proyectos" }],
  },
  {
    label: "Configuración",
    children: [{ label: "Configuraciones" }],
  },
];

export const SideBarView: FC = () => {
  const { open, toggle } = useSideBar();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#0f172a",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6">Grupo 1</Typography>
      </Toolbar>

      <List>
        {menu.map((item) => (
          <div key={item.label}>
            <ListItemButton onClick={() => toggle(item.label)}>
              <ListItemText primary={item.label} />
              {open[item.label] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open[item.label]}>
              <List>
                {item.children?.map((child) => (
                  <SideBarItem key={child.label} label={child.label} />
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Drawer>
  );
};
EOF

echo "✅ SideBar creado correctamente"