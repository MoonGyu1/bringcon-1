import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Form, Input, Icon, Col } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import Progress from "../../utils/Progress/Progress";
import mobile from "../Main/mobile.png";
import "./Upload.css";
import "../../utils/Hashtag.css";
import Swal from "sweetalert2";
import Success from "../../utils/Success.svg";
import Error from "../../utils/Error.svg";

const { TextArea } = Input;

const Genres = [
  { key: 1, value: "Animals" },
  { key: 2, value: "Animations" },
  { key: 3, value: "Arts" },
  { key: 4, value: "Broadcasting" },
  { key: 5, value: "Business" },
  { key: 6, value: "Cartoon" },
  { key: 7, value: "Character" },
  { key: 8, value: "Land-marks" },
  { key: 9, value: "Music" },
  { key: 10, value: "Nature" },
  { key: 11, value: "Sports" },
  { key: 12, value: "Etc" },
];

function UploadProductPage(props) {
  const user = useSelector((state) => state.user);
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Genre, setGenre] = useState(1);
  const [Images, setImages] = useState([]);
  const [FilePath, setFilePath] = useState("");
  const [WMfilePath, setWMfilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [S3thumbnailPath, setS3thumbnailPath] = useState("");
  const [Tags, setTags] = useState([]);
  const [progress, setProgress] = useState(0);
  const [hasAccount, setAccount] = useState(false);
  const [Width, setWidth] = useState(0);
  const [Height, setHeight] = useState(0);
  const [Format, setFormat] = useState("");

  const removeTags = (indexToRemove) => {
    setTags(Tags.filter((_, index) => index !== indexToRemove));
  };
  const addTags = (event) => {
    if (event.keyCode === 32 && event.target.value !== "") {
      setTags([...Tags, event.target.value.trim()]); //공백 제거
      event.target.value = "";
    }
  };

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value);
  };

  const genreChangeHandler = (event) => {
    setGenre(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const resetHandler = (event) => {
    event.preventDefault();
    window.location.replace("/product/upload");
  };

  const dropHandler = (files) => {
    setProgress(0);
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
      //프로그레스 바 상태 config에 추가
      onUploadProgress: (progressEvent) => {
        setProgress(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    };

    if (files[0].size > 314572800) {
      // 300M
      Swal.fire({
        title: "Oops...",
        text: "300MB를 초과하는 파일은 업로드할 수 없습니다.",
        imageUrl: Error,
        imageWidth: 200,
        imageHeight: 176,
        background: "#fff url(../Main/background.svg)",
      });
      return;
    }

    formData.append("file", files[0]);

    Axios.post("/api/product/video", formData, config).then((response) => {
      if (response.data.success) {
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.s3VideoPath);
        setWMfilePath(response.data.wm_s3VideoPath);

        Axios.post("/api/product/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.filePath);
            setS3thumbnailPath(response.data.s3FilePath);
            setImages((Images) => [...Images, response.data.filePath]);
            setWidth(response.data.fileWidth);
            setHeight(response.data.fileHeight);
            setFormat(response.data.fileFormat);
          } else {
            setProgress(0);
            Swal.fire({
              title: "Oops...",
              text: "썸네일 생성에 실패했습니다..",
              imageUrl: Error,
              imageWidth: 200,
              imageHeight: 176,
              background: "#fff url(../Main/background.svg)",
            });
          }
        });
      } else {
        if (response.data.err === "not allowed format") {
          Swal.fire({
            title: "Oops...",
            text: "파일 확장자를 확인해주세요!",
            imageUrl: Error,
            imageWidth: 200,
            imageHeight: 176,
            background: "#fff url(../Main/background.svg)",
          });
        } else {
          Swal.fire({
            title: "Oops...",
            text: "파일을 저장하지 못했습니다.",
            imageUrl: Error,
            imageWidth: 200,
            imageHeight: 176,
            background: "#fff url(../Main/background.svg)",
          });
        }
        setProgress(0);
      }
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!Title || !Description || !Price || !Genre || Images.length === 0) {
      Swal.fire("Data?", "모든 값을 넣어주셔야 합니다.", "question");
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      writer: user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      genres: Genre,
      filePath: FilePath,
      wmFilePath: WMfilePath,
      duration: Duration,
      thumbnail: ThumbnailPath,
      s3thumbnail: S3thumbnailPath,
      tags: Tags,
      width: Width,
      height: Height,
      format: Format,
    };

    Axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "상품 업로드에 성공했습니다.",
          imageUrl: Success,
          imageWidth: 200,
          imageHeight: 176,
          background: "#fff url(../Main/background.svg)",
        });
        props.history.push("/contents");
      } else {
        Swal.fire({
          title: "Oops...!",
          text: "상품 업로드에 실패했습니다.",
          imageUrl: Success,
          imageWidth: 200,
          imageHeight: 176,
          background: "#fff url(../Main/background.svg)",
        });
      }
    });
  };

  if (hasAccount === false) {
    if (user.userData && user.userData.bank !== undefined) {
      setAccount(true);
    }

    return (
      <div
        style={{ width: "100vw", height: "90vh", margin: "auto" }}
        className="upload-body"
      >
        {" "}
        <div
          style={{ width: "90%", margin: "auto", paddingTop: "50px" }}
          className="upload-box"
        >
          <a href="/user/account">
            판매자 정보를 입력해야 동영상을 업로드 할 수 있습니다.
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="small-body">
        <img src={mobile} className="mobile" />
      </div>
      <div
        style={{ width: "auto", minHeight: "90vh", margin: "auto" }}
        id="body"
      >
        <div
          style={{ width: "90%", margin: "auto", paddingTop: "50px" }}
          className="upload-box"
        >
          <Form onSubmit={submitHandler}>
            <Col lg={12} sm={24} className="upload-zone">
              <div style={{ justifyContent: "space-between" }}>
                {!progress ? (
                  <Dropzone
                    onDrop={dropHandler}
                    multiple={false}
                    // maxSize={100000000}
                    refreshFunction={updateImages}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        style={{
                          width: 629,
                          height: 354,
                          border: "3px solid #ffcb39",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "12px",
                        }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <Icon
                          type="plus"
                          style={{ fontSize: "3rem" }}
                          className="plus-icon"
                        />
                      </div>
                    )}
                  </Dropzone>
                ) : ThumbnailPath ? (
                  <div>
                    <img
                      style={{
                        width: 629,
                        height: 354,
                        border: "3px solid #ffcb39",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                      }}
                      src={`http://${window.location.hostname}:443/${ThumbnailPath}`}
                      alt="thumbnail"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 629,
                      height: 354,
                      border: "3px solid #ffcb39",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                    }}
                  >
                    <Progress percentage={progress} />
                  </div>
                )}
              </div>

              <br />
              <br />
              <Input
                onChange={titleChangeHandler}
                value={Title}
                placeholder="제목을 입력하세요."
                className="upload-title"
                style={{ backgroundColor: "#1C1C1C", color: "#fff" }}
                maxLength={100}
                showCount
              />
              <Input
                type="number"
                onChange={priceChangeHandler}
                placeholder="가격을 입력하세요."
                className="upload-price"
                style={{ backgroundColor: "#1C1C1C", color: "#fff" }}
              />
              <br />
              <br />
              <button onClick={resetHandler} className="upload-reset">
                초기화
              </button>
              <button type="submit" className="upload-submit">
                업로드하기
              </button>
            </Col>
            <Col lg={12} sm={24} className="upload-info">
              <div className="box">
                <div className="tags-input">
                  <input
                    className="upload-tags"
                    type="text"
                    placeholder="스페이스바를 눌러 해시태그를 입력하세요"
                    onKeyUp={(e) => (e.keyCode === 32 ? addTags(e) : null)}
                  />
                </div>
                <div>
                  <ul>
                    {Tags.map((tag, index) => (
                      <li key={index} className="tag">
                        <span>{tag}</span>
                        <span
                          className="tag-close-icon"
                          onClick={() => removeTags(index)}
                        >
                          X
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr
                  className="upload-line"
                  style={{
                    height: "3px",
                    backgroundColor: "#ffcb39",
                    border: "none",
                  }}
                />
                <select
                  onChange={genreChangeHandler}
                  value={Genre}
                  className="genres-dropdown"
                >
                  {Genres.map((item) => (
                    <option key={item.key} value={item.key}>
                      {" "}
                      {item.value}
                    </option>
                  ))}
                </select>
                <button className="video-setting" disabled>
                  {" "}
                  확장자 {Format}
                </button>
                <button className="video-setting" disabled>
                  {" "}
                  {Width} x {Height}
                </button>
                <TextArea
                  onChange={descriptionChangeHandler}
                  value={Description}
                  style={{
                    width: "491px",
                    height: "287px",
                    marginLeft: "42px",
                    background: "transparent",
                    color: "#fff",
                  }}
                  className="upload-description"
                  placeholder="영상에 대한 상세 설명을 작성하세요."
                />
              </div>
            </Col>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default UploadProductPage;
