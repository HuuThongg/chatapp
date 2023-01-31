import {useState, useRef, useEffect} from 'react'
import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import { Session } from 'next-auth'
import { Message } from '../../constants/schemas'
import { signIn, signOut, useSession } from 'next-auth/react'


function resizeImage(imageData: string, newWidth: number, newHeight: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const image = new Image();
  image.src = imageData;
  canvas.width = newWidth;
  canvas.height = newHeight;
  context.drawImage(image, 0, 0, newWidth, newHeight);
  return canvas.toDataURL();
}
  
function MessageItem({message,session}:{message: Message,session: Session}){
  
  const baseStyles = "mb-4 text-md w-7/12 p-4 text-gray-700 border border-gray-700 rounded-md"
  const liStyles = message.sender.name === session.user?.name ? baseStyles : baseStyles.concat("self-end bg-gray-700 text-white")
  
  return (
    <li className={liStyles}>
      <div className='flex'>
        <time>
          {message.sentAt.toLocaleTimeString("en-AU", {
            timeStyle:"short"
          })}{" "}
          - {message.sender.name}
        </time>
      </div>
      {message.message}
    </li>
  )
}


type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const RoomPage = () => {
  const [imageData, setImageData] = useState("");
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const canvasRefResize = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };
  const handleResize = () => {
    if (!canvasRefResize.current) return;
    const context = canvasRefResize.current.getContext("2d");
    const image = new Image();
    image.src = imageData;

    // const aspectRatio = originalWidth / originalHeight;
    // let newWidth = 500;
    // let newHeight = newWidth / aspectRatio;

    canvasRefResize.current.width = newWidth;
    canvasRefResize.current.height = newHeight;
    context?.drawImage(image, 0, 0, newWidth, newHeight);

    // reducing the quality of the image
    // canvasRefResize.current.toBlob(
    //   (blob) => {
    //     if (blob) {
    //       compressedImageBlob = blob;
    //       compressedImage.src = URL.createObjectURL(compressedImageBlob);
    //       document.querySelector("#size").innerHTML = bytesToSize(blob.size);
    //     }
    //   },
    //   "image/jpeg",
    //   quality
    // );

    setImageData(canvasRefResize.current.toDataURL());
  };



  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 400, height: 400 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImage(e.currentTarget);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDragging) return;
    const x = -e.nativeEvent.offsetX;
    const y = -e.nativeEvent.offsetY;
    setCrop(prevCrop => ({ ...prevCrop, x, y }));
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0,canvas.width, canvas.height);
    context.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [crop, image]);






  const [format, setFormat] = useState("jpeg");
  const [newImageData, setNewImageData] = useState(imageData);

  const changeFormat = (e) => {
    setFormat(e.target.value);
  };

  const convertImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = imageData;

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);




    let newImageData;
    if (format === "jpeg") {
      newImageData = canvas.toDataURL("image/jpeg");
    } else if (format === "png") {
      newImageData = canvas.toDataURL("image/png");
    } else if (format === "webp") {
      newImageData = canvas.toDataURL("image/webp");
    }
    setNewImageData(newImageData);
  };

  return (
    <div className='flex flex-col'>
      <div>

        <input type="file" multiple onChange={handleFileChange} />
        <div>
          <input
            type="number"
            value={newWidth}
            onChange={e => setNewWidth(Number(e.target.value))}
          />
          <input
            type="number"
            value={newHeight}
            onChange={e => setNewHeight(Number(e.target.value))}
          />
          <button onClick={handleResize}>Resize</button>
        </div>
        <canvas ref={canvasRefResize} className=''/>
        {/* <img src={imageData} /> */}
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          width={crop.width}
          height={crop.height}
          style={{
            border: '1px solid black',
          }}
        />
        <img src={imageData} onLoad={onLoad} style={{ display: 'none' }} />
      </div>


      <div>
        <img src={newImageData} alt="Original Image" />
        <div>
          <select onChange={changeFormat}>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>
          <button onClick={convertImage}>Convert</button>
        </div>
        <img src={newImageData} alt="Converted Image" />
      </div>
    </div>
  )
}

export default RoomPage
