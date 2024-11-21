import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  font-family: "Arial", sans-serif;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const FileInput = styled.input`
  margin-bottom: 15px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #e9f7ef;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  word-break: break-word;
`;

const Error = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  word-break: break-word;
`;

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setFile(reader.result.split(",")[1]); // Base64 string without the prefix
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setResponse(null);
        setError(null);

        try {
            const parsedInput = JSON.parse(jsonInput);

            const payload = {
                data: parsedInput.data,
                file_b64: file || null,
            };

            const res = await axios.post("http://localhost:5000/bfhl", payload); // Update URL for deployment
            setResponse(res.data);
        } catch (err) {
            setError(err.message || "Invalid input or server error");
        }
    };

    return (
        <Container>
            <Header>BFHL API Interface</Header>
            <Form>
                <TextArea
                    placeholder='Enter JSON input, e.g., {"data": ["a", "B", "3"]}'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />
                <FileInput type="file" onChange={handleFileChange} />
                <Button onClick={handleSubmit}>Submit</Button>
            </Form>
            {response && (
                <Result>
                    <strong>Response:</strong> <pre>{JSON.stringify(response, null, 2)}</pre>
                </Result>
            )}
            {error && (
                <Error>
                    <strong>Error:</strong> {error}
                </Error>
            )}
        </Container>
    );
}

export default App;
