import { serverHttp } from "./http";
import "./socket";

const port = 3000;

serverHttp.listen(port, () => {
  console.log(`Server is runnig on ports ${port}.`)
});
