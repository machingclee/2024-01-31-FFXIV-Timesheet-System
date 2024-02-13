import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { tss } from 'tss-react';
import { TEXT_COLOR, TEXT_DARK_COLOR } from '@/component/Body';
import { useAppSelector } from '@/redux/hooks';
import boxShadow from '@/constants/boxShadow';
import useMenuStyle from '@/app/style/useMenuStyle';

export default ({ menuItems }: {
    menuItems: { label: string, action: () => (void | Promise<void>) }[]
}) => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const { classes, cx } = useMenuStyle({ darkMode });
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
