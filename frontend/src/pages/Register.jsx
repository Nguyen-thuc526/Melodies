import { Card, Typography, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authService from '../services/authService';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Please input your username!")
      .min(3, "Username must be at least 3 characters!"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please input your email!"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Please input your password!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required("Please confirm your password!"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      
      message.success({
        content: 'Registration successful! Welcome to Melodies.',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
      
      // Đợi 2 giây để user đọc thông báo
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      message.error({
        content: error.response?.data?.message || 'Registration failed. Please try again.',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #1a1221 0%, #2D1F31 100%)" }}>
      <Card
        style={{
          width: 400,
          background: "linear-gradient(135deg, #3d2a3a 0%, #4d3649 100%)",
          borderRadius: "24px",
          border: "none",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 31, 156, 0.15)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: "40px 24px 20px", textAlign: "center" }}>
          <Title level={3} style={{ color: "#ff1f9c", fontWeight: "bold", textShadow: "0 0 10px rgba(255, 31, 156, 0.5)" }}>Melodies</Title>
          <Title level={3} style={{ color: "white", margin: 0, fontWeight: "bold" }}>Create an Account</Title>
        </div>

        <Formik
          initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form style={{ padding: "0 24px" }} onSubmit={handleSubmit}>
              {/* Username Field */}
              <div style={{ marginBottom: 16 }}>
                <Field name="username">
                  {({ field }) => (
                    <Input
                      {...field}
                      prefix={<UserOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                      placeholder="Username"
                      size="large"
                      style={{
                        color: "white",
                        backgroundColor: "rgba(91, 73, 89, 0.7)",
                        borderRadius: "24px",
                        height: "56px",
                        border: "1px solid rgba(255, 31, 156, 0.3)",
                      }}
                      className="custom-input"
                    />
                  )}
                </Field>
                <ErrorMessage name="username" component="div" style={{ color: "#ff4db2", fontSize: "12px", marginTop: 4 }} />
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: 16 }}>
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      prefix={<MailOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                      placeholder="Email"
                      size="large"
                      style={{
                        color: "white",
                        backgroundColor: "rgba(91, 73, 89, 0.7)",
                        borderRadius: "24px",
                        height: "56px",
                        border: "1px solid rgba(255, 31, 156, 0.3)",
                      }}
                      className="custom-input"
                    />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" style={{ color: "#ff4db2", fontSize: "12px", marginTop: 4 }} />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: 16 }}>
                <Field name="password">
                  {({ field }) => (
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                      placeholder="Password"
                      size="large"
                      style={{
                        color: "white",
                        backgroundColor: "rgba(91, 73, 89, 0.7)",
                        borderRadius: "24px",
                        height: "56px",
                        border: "1px solid rgba(255, 31, 156, 0.3)",
                      }}
                      className="custom-input"
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" style={{ color: "#ff4db2", fontSize: "12px", marginTop: 4 }} />
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: 24 }}>
                <Field name="confirmPassword">
                  {({ field }) => (
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                      placeholder="Confirm Password"
                      size="large"
                      style={{
                        color: "white",
                        backgroundColor: "rgba(91, 73, 89, 0.7)",
                        borderRadius: "24px",
                        height: "56px",
                        border: "1px solid rgba(255, 31, 156, 0.3)",
                      }}
                      className="custom-input"
                    />
                  )}
                </Field>
                <ErrorMessage name="confirmPassword" component="div" style={{ color: "#ff4db2", fontSize: "12px", marginTop: 4 }} />
              </div>

              {/* Sign Up Button */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)",
                    fontWeight: "bold",
                    border: "none",
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Login Section */}
        <div style={{ background: "linear-gradient(135deg, #332433 0%, #3d2a3a 100%)", padding: "40px 24px 24px", textAlign: "center" }}>
          <Title level={4} style={{ color: "white", margin: 0, fontWeight: "bold" }}>Already Have An Account?</Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.9)", display: "block", marginBottom: 16, fontSize: "16px" }}>Login Here</Text>
          <Link to="/login">
            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: "24px",
                background: "linear-gradient(135deg, #0099ff 0%, #33b1ff 100%)",
                fontWeight: "bold",
                border: "none",
              }}
            >
              Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

const fields = [
  { name: "name", placeholder: "Name", icon: <UserOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} /> },
  { name: "email", placeholder: "E-Mail", icon: <MailOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} /> },
  { name: "password", placeholder: "Password", icon: <LockOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} /> },
  { name: "phone", placeholder: "Phone Number", icon: <PhoneOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} /> },
];

const inputStyle = {
  color: "white",
  backgroundColor: "rgba(91, 73, 89, 0.7)",
  borderRadius: "24px",
  height: "56px",
  border: "1px solid rgba(255, 31, 156, 0.3)",
};

const errorStyle = {
  color: "#ff4db2",
  fontSize: "12px",
  marginTop: 4,
};

const buttonStyle = {
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ff1f9c 0%, #ff4db2 100%)",
  fontWeight: "bold",
  border: "none",
};

const loginButtonStyle = {
  borderRadius: "24px",
  background: "linear-gradient(135deg, #0099ff 0%, #33b1ff 100%)",
  fontWeight: "bold",
  border: "none",
};

export default Register;
