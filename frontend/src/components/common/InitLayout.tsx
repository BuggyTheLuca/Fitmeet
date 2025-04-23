import { Outlet } from "react-router-dom";
import initImage from '../../assets/images/init-image.png';

export function InitLayout (){
    return <div className="flex flex-row justify-between items-center w-full h-[95vh]">
    <img
      src={initImage}
      alt=""
      className="w-1/2 h-full object-cover rounded-md"
    />
    <div className="w-1/2 h-full flex items-center">
      <Outlet />
    </div>
  </div>
}