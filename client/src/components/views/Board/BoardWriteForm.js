import React, { useState, useEffect } from "react";
import { CKEditor } from "ckeditor4-react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import "./css/BoardWrite.css";

function BoardWriteForm(props) {
  const user = useSelector((state) => state.user);
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const contentChangeHandler = (event) => {
    const data = event.editor.getData();
    setContent(data);
  };

    //게시글 수정하는 경우
    useEffect(() => {
      if(props.location.query !== undefined) {
        setTitle(props.location.query.title)
        setContent(props.location.query.content)
      }
      console.log(props.location.hasOwnProperty('query'))
      console.log(props.location.query)
    }, [])

  const writeBoardHandler = (event) => {
    event.preventDefault();

    if (!Title || Title.length === 0) {
      Swal.fire(
        'Title?',
        '제목을 입력해주세요',
        'question'
      )
    } else if (!Content || Content.length === 0) {
      Swal.fire(
        'Content?',
        '내용을 입력해주세요',
        'question'
      )
    }
    
    //게시물 수정하는 경우
    if(props.location.hasOwnProperty('query')){
      const body = {
        _id: props.location.query._id,
        title: Title,
        content: Content,
      }

      axios.post("/api/board/update", body).then((response) => {
        if (response.data.success) {
          console.log(response.data);
          Swal.fire({
            title: 'Success!',
            text: '게시글이 수정되었습니다.',
            imageUrl: './success.svg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom Image',
            background: '#fff url(../Footer/background.svg)',
          })
          props.history.push("/board");
        } else {
          alert("게시글 수정에 실패했습니다.");
        }
      });

    } else { //새로운 게시글 올리는 경우
      const body = {
        writer: user.userData._id,
        name: user.userData.name,
        title: Title,
        content: Content,
      };
  
      axios.post("/api/board/upload", body).then((response) => {
        if (response.data.success) {
          console.log(response.data);
          Swal.fire({
            title: 'Success!',
            text: '게시글 업로드에 성공했습니다.',
            imageUrl: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/32873994-ad5b-4017-b6b4-66860f107328/pop-up_success.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051516Z&X-Amz-Expires=86400&X-Amz-Signature=aa742b6b46f0a0cf42652c71d41602c2a69e9309e7b0bf709059f0dd793e2b3c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22pop-up_success.svg%22',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom Image',
            background: '#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051556Z&X-Amz-Expires=86400&X-Amz-Signature=e0cd25d9c0ca96f3cfa764e2a894db9f8f1b216d68f762ea97bedc9149d5abf6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)',
          })
          props.history.push("/board");
        } else {
          alert("글쓰기에 실패했습니다.");
        }
      });
    }
  };

  const divStyle = {
    margin: 50,
    width: '60%',
    margin: 'auto'
  };

  const titleStyle = {
    marginBottom: 20,
    width: '60%',
    color: '#ffcb39'
  };

  return (
    <div id="body" style={{width: 'auto'}}>
      <div className="form-container">
      <Form onSubmit={writeBoardHandler}>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          onChange={titleChangeHandler}
          value={Title}
          className="title-input"
        />
        <CKEditor initData={props.location.hasOwnProperty('query') && props.location.query.content} data={Content} onChange={contentChangeHandler}></CKEditor>
        <button className="board-write-button" type="submit" block>
          저장하기
        </button>
      </Form>
      </div>
    </div>
  );
}

export default BoardWriteForm;
