import { Box, Typography, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  // Define the path to your background image
  const backgroundImage = "url(/assets/bg1.jpg)"; // Adjust the path if needed

  return (
    <Box
      style={{
        background: `${backgroundImage} center/cover no-repeat fixed`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        borderRadius="1.5rem"
        backgroundColor="white" // Set background color to white
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary" textAlign="center">
          SociaLink
        </Typography>

        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }} textAlign="center">
          Welcome to SociaLink: Connect & Share
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
