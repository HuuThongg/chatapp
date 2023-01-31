export default function useResizeImage= (
  imageData: string,
  newWidth: number,
  newHeight: number
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const image = new Image();
  image.src = imageData;
  canvas.width = newWidth;
  canvas.height = newHeight;
  context.drawImage(image, 0, 0, newWidth, newHeight);
  return canvas.toDataURL();
};

// import { useState } from "react";

// export default function useOnChange(initialValues: { [Key: string]: string }) {
//   const [values, setValues] = useState<{ [Key: string]: string }>(
//     initialValues
//   );

//   const handleChange = (
//     event:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLTextAreaElement>
//   ) => {
//     setValues((values) => ({
//       ...values,
//       [event.target.name]: event.target.value,
//     }));
//   };
//   return {
//     values,
//     setValues,
//     handleChange,
//   };
// }