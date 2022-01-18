import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const InfoBox = ({ title, cases, total }) => {
  return (
    <Card className="infoBox">
      <CardContent>
        {/* title */}
        <Typography className="infoBox__title"color="textSecondary">{title}</Typography>
        {/* number of cases */}
        <h2 className="infoBox__cases">{cases}</h2>
        {/* total */}
        <Typography className="infoBox__total" color="textSecondary">{total}Total</Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
