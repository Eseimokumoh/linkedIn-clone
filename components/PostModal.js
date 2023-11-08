import { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from "firebase/compat/app";
import { Timestamp } from 'firebase/firestore';
import { postArticleAPI } from "../actions";

const PostModal = (props) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];

    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }

    setShareImage(image);
  };

  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const postArticle = (e) => {
    e.preventDefault();

    if (e.target !== e.currentTarget) {
      return;
    }

    const timestamp = Timestamp.now();


    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: timestamp,
    };

    props.postArticle(payload);
    reset(e);
  };

  const reset = (e) => {
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <img
                className="icon"
                src="/images/211652_close_icon.svg"
                alt=""
                onClick={(event) => reset(event)}
              />
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user.photoURL ? (
                  <img src={props.user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span>
                  {props.user.displayName ? props.user.displayName : "Name"}
                </span>
              </UserInfo>

              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/png"
                      name="image"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file">Select an image to share</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} alt="" />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === "media" && (
                    <>
                      <input
                        type="text"
                        placeholder="Please input a video link"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && (
                        <ReactPlayer width={"100%"} url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>
            <SharedCreation>
              <AttachAssets>
                <img
                  className="icon"
                  src="/images/shared_video.png"
                  alt=""
                  onClick={() => switchAssetArea("image")}
                />

                <img
                  className="icon"
                  src="/images/shared_picture.png"
                  alt=""
                  onClick={() => switchAssetArea("media")}
                />
              </AttachAssets>
              <ShareComment>
                <img
                  className="icon" 
                  src="/images/shared_comments.png" 
                  alt="" />
                Anyone
              </ShareComment>

              <PostButton
                disabled={!editorText ? true : false}
                onClick={(event) => postArticle(event)}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-weight: 400;
  }

  svg,
  img {
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
  }

  img:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;

  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  border-right: 1px solid rgba(0, 0, 0, 0.15);

  img {
    padding: 5px;
    border-radius: 50%;
    margin-right: 3px;
    cursor: pointer;
  }
  img:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const ShareComment = styled.div`
  margin-left: 15px;
  margin-right: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px 0 5px;
  border-radius: 15px;

  img {
    padding: 5px;
    border-radius: 50%;
    margin-right: 3px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border: none;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) =>
    props.disabled ? "rgba(0, 0, 0, 0.14)" : "#0a66c2"};
  color: ${(props) => (props.disabled ? "rgba(1, 1, 1, 0.2)" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) =>
      props.disabled ? "rgba(0, 0, 0, 0.08)" : "#004182"};
  }
`;

const Editor = styled.div`
  padding: 12px 36px 12px 24px;

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    border: none;
    outline: none;
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
    border: none;
    outline: none;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    text-align: center;
  }
`;

const UploadImage = styled.div`
  text-align: center;

  img {
    width: 100%;
  }

  p {
    label {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      color: black;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postArticle: (payload) => dispatch(postArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);