import ClipLoader from "react-spinners/ClipLoader";
export default function Loader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader color="#f84992" />
    </div>
  );
}
