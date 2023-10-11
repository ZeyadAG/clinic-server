import { useState } from "react";
import {FcAbout} from 'react-icons/fc'
import { Button, Card, TextField } from "@mui/material";
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="">
        <h1 className="flex w-screen">Vite + React</h1>
        <Card className="p-8">
          <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </Button>
          <h1>TEST FONT</h1>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </Card>
        <FcAbout />
      </div>
    </>
  );
}

export default App;
