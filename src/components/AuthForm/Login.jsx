import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  //creating a object to store the user authentication inputs as key-value pairs.
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { loading, error, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Targetting the value entered as email by the user and storing it in setInputs object.*/}
      <Input
        placeholder="Email"
        type="email"
        fontSize={14}
        value={inputs.email}
        size={"sm"}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
      />

      {/* Adding Show & Hide Password feature */}
      <InputGroup>
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          fontSize={14}
          value={inputs.password}
          size={"sm"}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />
        <InputRightElement h="full">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}

      <Button
        w={"full"}
        colorScheme="blue"
        size={"sm"}
        fontSize={14}
        isLoading={loading}
        onClick={() => login(inputs)}
      >
        Log in
      </Button>
    </>
  );
};

export default Login;
