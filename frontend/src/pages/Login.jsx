
import { Card, Typography, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authService from '../services/authService';


const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();


  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Please input your email!"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Please input your password!"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password
      });
      
      message.success({
        content: 'Login successful! Welcome back.',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
      
      // Đợi 2 giây để user đọc thông báo
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      message.error({
        content: error.message || 'Login failed. Please try again.',
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
        {/* Logo */}
        <div style={{ padding: "40px 24px 20px", textAlign: "center" }}>
          <Title level={3} style={{ color: "#ff1f9c", fontWeight: "bold", textShadow: "0 0 10px rgba(255, 31, 156, 0.5)" }}>Melodies</Title>
          <Title level={3} style={{ color: "white", margin: 0, fontWeight: "bold" }}>Login To Continue</Title>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}

        >
          {({ handleSubmit }) => (
            <Form style={{ padding: "0 24px" }} onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: 16 }}>
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      prefix={<UserOutlined style={{ color: "rgba(255, 255, 255, 0.8)" }} />}
                      placeholder="E-Mail"
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

              {/* Login Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Link to="/forgot-password" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px", fontWeight: "500" }}>Forgot password</Link>
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
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Social Login */}
        <div style={{ padding: "0 24px", marginBottom: 24 }}>
          <Button
            icon={<GoogleOutlined style={{ fontSize: "18px" }} />}
            block
            size="large"
            style={{
              marginBottom: 16,
              borderRadius: "24px",
              height: "48px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              fontWeight: "500",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            Google Login
          </Button>

          <Button
            icon={<FacebookOutlined style={{ fontSize: "20px" }} />}
            block
            size="large"
            style={{
              borderRadius: "24px",
              height: "48px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              fontWeight: "500",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            Facebook Login
          </Button>
        </div>

        {/* Signup Section */}
        <div style={{ background: "linear-gradient(135deg, #332433 0%, #3d2a3a 100%)", padding: "40px 24px 24px", textAlign: "center" }}>

          <Title level={4} style={{ color: "white", margin: 0, fontWeight: "bold" }}>Don’t Have An Account?</Title>

          <Text style={{ color: "rgba(255, 255, 255, 0.9)", display: "block", marginBottom: 16, fontSize: "16px" }}>Sign Up Here</Text>
          <Link to="/register">
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
              Sign Up
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
