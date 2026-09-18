import React, { useState } from "react";
import {
  Button,
  Form,
  Heading,
  TextField,
  View,
  Text,
  StatusLight,
  ProgressCircle,
} from "@adobe/react-spectrum";
import { useLocation, useNavigate } from "react-router-dom";

import actionWebInvoke from "../utils";
import allActions from "../config.json";

export function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError(false);

    const headers = {
      "Content-Type": "application/json",
    };

    // Add Adobe authentication headers when available
    if (props.ims?.token) {
      headers.authorization = `Bearer ${props.ims.token}`;
    }

    if (props.ims?.org) {
      headers["x-gw-ims-org-id"] = props.ims.org;
    }

    try {
      const response = await actionWebInvoke(allActions.login, headers, {
        email,
        password,
      });

      console.log("Login response:", response);

      if (response.success) {
        console.log("User token:", response.token);
        console.log("Logged-in user:", response.user);
        console.log("Token expires at:", response.expiresAt);

        /*
         * Stop loading before navigating.
         * Login will be unmounted after navigate(),
         * so we must not update its state afterward.
         */
        setLoading(false);

        navigate("/", {
          state: {
            message: "Welcome back! You have successfully logged in.",
          },
        });

        return;
      }

      setMessage(response.message || "Unable to log in.");
      setError(true);
      setLoading(false);
    } catch (err) {
      console.log("Login error:", err);

      if (err.status === 400) {
        setMessage("Please enter your email and password.");
      } else if (err.status === 401) {
        setMessage("Invalid email or password.");
      } else if (err.status === 500) {
        setMessage("We could not log you in. Please try again.");
      } else {
        setMessage("Unable to log in. Please try again.");
      }

      setError(true);
      setLoading(false);
    }
  }

  return (
    <View maxWidth="size-4600" margin="auto">
      <Heading level={1}>Login</Heading>

      {message && (
        <View marginBottom="size-200">
          <Text>
            <StatusLight variant={error ? "negative" : "positive"}>
              {message}
            </StatusLight>
          </Text>
        </View>
      )}

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Email or Name"
          value={email}
          onChange={setEmail}
          isRequired
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          isRequired
        />

        <Button type="submit" variant="accent" isDisabled={loading}>
          {loading ? (
            <ProgressCircle aria-label="Logging in" isIndeterminate size="S" />
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </View>
  );
}
