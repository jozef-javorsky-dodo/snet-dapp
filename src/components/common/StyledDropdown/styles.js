import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  formControl: {
    "& .MuiFormLabel-root": {
      backgroundColor: theme.palette.text.white,
      padding: "0 4px",
    },
  },
  selectEmpty: {
    fontFamily: theme.typography.primary.main,
    color: `${theme.palette.text.dialogTitle} !important`,
    "& .MuiSelect-root": {
      letterSpacing: 0.15,
      lineHeight: "24px",
    },
    "&:before": { display: "none" },
    "& select": {
      "&:hover": {
        backgroundColor: theme.palette.text.transBlueBorderBgHover,
      },
    },
    "& .MuiSelect-select": {
      "&:focus": { backgroundColor: "transparent" },
    },
  },
}));
