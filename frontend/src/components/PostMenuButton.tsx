import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

const options = [
  'Edit',
  'Delete',
];

const ITEM_HEIGHT = 48;

export default function PostMenu({ postId }: { postId: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleMenuItemClick = (option: string) => {
    handleClose();
    if (option === 'Edit') {
      navigate(`/posts/${postId}/edit`);
    }
    // Handle delete here if needed
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}