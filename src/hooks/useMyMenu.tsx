import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { tss } from 'tss-react';
import { TEXT_COLOR } from '@/component/Body';

export default ({ menuItems }: {
    menuItems: { label: string, action: () => (void | Promise<void>) }[]
}) => {
    const { classes, cx } = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menu = () => {
        return (
            <Menu
                className={cx(classes.eventMenu)}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map(item => {
                    const { action, label } = item;
                    return (
                        <MenuItem
                            key={label}
                            onClick={async () => {
                                await action();
                                handleClose();
                            }}>
                            {label}
                        </MenuItem>
                    )
                })}
            </Menu>
        )
    }

    return { menu, openMenu }
}

const useStyles = tss.create(() => ({
    eventMenu: {
        transform: "translateX(-10px)",
        "& .MuiPaper-root": {
            width: 200,
            color: TEXT_COLOR,
            "& .MuiMenu-list": {
                paddingTop: 0,
                paddingBottom: 0
            },
            backgroundColor: "rgba(0,0,0,0.05)",
            backdropFilter: "blur(100px)"
        }
    }
}))