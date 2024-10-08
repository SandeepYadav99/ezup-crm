import React, { useState } from "react";
import styles from "./Style.module.css";
import EventEmitter from "../../libs/Events.utils";
import csx from "classnames";
import SnackbarUtils from "../../libs/SnackbarUtils";


const UploadImage = (
  {
    multiple,
    type,
    max_count,
    max_size,
    onChange,
    default_image,
    user_image,
    accept,
    error,
    placeholder,
    name,
    component,
    title,
    show_image,
    banner,
    link,
    circular,
    bannerLabel,
    isBlogPage,
    not_default_width,
    not_default_height,
  },
  props
) => {
  const [value, setValue] = useState("");

  const handleFileChange = (e) => {
    const allowedArr = type;
    const maxCount = max_count ? max_count : 0;
    let isError = false;
    let tempTotal = 0;
    let totalValid = 0;
    e.preventDefault();
    if (e.target.files[0]) {
      const tempFiles = [];

      Object.keys(e.target.files).forEach((key) => {
        if (multiple && maxCount !== 0 && maxCount <= tempTotal) {
          return true;
        }
        const tempFile = e.target.files[key];
        const sFileName = tempFile.name;
        const sFileExtension = sFileName.split(".").pop().toLowerCase();
        const fileSize = tempFile.size;

        if (
          fileSize <= max_size &&
          (allowedArr.length > 0
            ? allowedArr.indexOf(sFileExtension) > -1
            : true)
        ) {
          tempFiles.push(tempFile);
          totalValid++;
        } else {
          isError = true;
          SnackbarUtils.error(
            `Maximum file upload size is ${max_size / (1024 * 1024)} MB`
          );
        }
        tempTotal++;
      });

      if (isError && totalValid < 1) {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
          error: "Invalid Upload",
          type: "error",
        });
      }
      if (tempFiles.length > 0) {
        setValue(multiple ? tempFiles : tempFiles[0]);
        onChange(tempFiles);
      }
    }
  };

  const getImageUrl = (value) => {
    if (value) {
      return URL.createObjectURL(value);
    } else if (default_image) {
      return default_image;
    } else if (user_image) {
      return require("../../assets/img/profile.png");
    }
  };

  const { renderImageComponent, imageClass } = props;

  let tempPlaceHolder = placeholder;
  if (value !== "" && value !== null) {
    if (value instanceof Object && !Array.isArray(value)) {
      tempPlaceHolder =
        value?.name?.length > 20 ? value?.name?.substr(0, 20) : value.name;
    } else {
      tempPlaceHolder = value?.length + " Selected";
    }
  }

  if (value != "" && value !== null) {
    if (value instanceof Object && !Array.isArray(value)) {
      tempPlaceHolder =
        value?.name?.length > 20 ? value?.name?.substr(0, 20) : value.name;
    } else {
      tempPlaceHolder = value?.length + " Selected";
    }
  }

  if (renderImageComponent) {
    return (
      <>{renderImageComponent(value, getImageUrl(value), handleFileChange)}</>
    );
  }

  if (show_image && !multiple && !bannerLabel) {
    return (
      <div>
        <div className={styles.imageBtnContainer}>
          <div>
            <div
              className={csx(styles.imagePlus, imageClass)}
              style={{
                backgroundImage: "url(" + getImageUrl(value) + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: error ? "red" : "#c2c2c2",
              }}
            ></div>
          </div>
          <div className={styles.imgLowerContainer}>
            <div className={styles.imgFileLabelPlus}>
              <span className={styles.plus}>
                {!value && !default_image ? "+" : ""}
              </span>
              <div className={styles.textUpload} style={error ? {} : {}}>
                {!value && !default_image ? "Upload" : ""}
              </div>
            </div>
            <input
              multiple={multiple}
              id="upload"
              data-value={"JPG"}
              accept={accept ? accept : "image/*"}
              onChange={handleFileChange}
              className={styles.fileInput}
              type="file"
            />
          </div>
        </div>
        <div className={styles.tooltipFlex}>
          <span className={styles.tipText}>{title ? title : ""}</span>
        </div>
      </div>
    );
  }

  if (bannerLabel && !multiple) {
    return (
      <div>
        <div
          className={
            isBlogPage
              ? not_default_width
                ? styles.widthBlog
                : styles.aspectWidth
              : styles.imageBtnContainerShow
          }
        >
          <div>
            <div
              className={csx(styles.imagePlusShow, imageClass)}
              style={{
                backgroundImage: "url(" + getImageUrl(value) + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: error ? "red" : "#c2c2c2",
                height: not_default_height && "427px",
              }}
            ></div>
          </div>
          <div className={styles.imgLowerContainer}>
            <div className={styles.imgFileLabelPlusShow}>
              <span className={styles.plus}>
                {!value && !default_image ? "+" : ""}
              </span>
              <div className={styles.textUpload} style={error ? {} : {}}>
                {!value && !default_image ? bannerLabel : ""}
              </div>
            </div>
            <input
              multiple={multiple}
              id="upload"
              data-value={"JPG"}
              accept={accept ? accept : "image/*"}
              onChange={handleFileChange}
              className={styles.fileInput}
              type="file"
            />
          </div>
        </div>
        <div className={styles.tooltipFlex}>
          <span className={styles.tipText}>{title ? title : ""}</span>
        </div>
      </div>
    );
  }

  if (circular && !multiple) {
    return (
      <div>
        <div className={styles.imageBtnContainer}>
          <div>
            <div
              className={csx(styles.imagePlus, imageClass)}
              style={{
                backgroundImage: "url(" + getImageUrl(value) + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "50%",
                borderColor: error ? "red" : "#c2c2c2",
              }}
            ></div>
          </div>
          <div className={styles.imgLowerContainer}>
            <div className={styles.imgFileLabelPlus}>
              <span className={styles.plus}>
                {!value && !default_image ? "+" : ""}
              </span>
              <div className={styles.textUpload} style={error ? {} : {}}>
                {!value && !default_image ? "Upload" : ""}
              </div>
            </div>
            <input
              multiple={multiple}
              id="upload"
              data-value={"JPG"}
              accept={accept ? accept : "image/*"}
              onChange={handleFileChange}
              className={styles.fileInput}
              type="file"
            />
          </div>
        </div>
        <div className={styles.tooltipFlex}>
          <span className={styles.tipText}>{title ? title : ""}</span>
        </div>
      </div>
    );
  }

  if (banner && !multiple) {
    return (
      <div>
        <div className={styles.imageBtnContainerNew}>
          <div>
            <div
              className={styles.imagePlusNew}
              style={{
                backgroundImage: "url(" + getImageUrl(value) + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: error ? "red" : "#c2c2c2",
              }}
            >
              <div className={styles.imgLowerContainer}>
                <div>
                  <span className={styles.plus}>
                    {!value && !default_image ? "+" : ""}
                  </span>
                  <div className={styles.textUpload} style={error ? {} : {}}>
                    {!value && !default_image ? "Upload Banner Image" : ""}
                  </div>
                </div>
                <input
                  multiple={multiple}
                  id="upload"
                  data-value={"JPG"}
                  accept={accept ? accept : "image/*"}
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  type="file"
                  title={""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tooltipFlex}>
          <span className={styles.tipText}>{title ? title : ""}</span>
        </div>
      </div>
    );
  }

  if (user_image && !multiple) {
    return (
      <div className={styles.file_upload}>
        <label className={styles.file_upload__label}>
          <div
            className={styles.image}
            style={{
              backgroundImage: "url(" + getImageUrl(value) + ")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderColor: error ? "red" : "#c2c2c2",
            }}
          ></div>
          <div className={styles.imgEditBtn}>
          </div>
        </label>
        <div className={styles.imgLowerContainer}>
          <input
            multiple={multiple}
            id="upload"
            data-value={"JPG"}
            accept={accept ? accept : "image/*"}
            onChange={handleFileChange}
            className={styles.fileInput}
            type="file"
          />
        </div>
      </div>
    );
  }
  if (component) {
    return (
      <div className={styles.positionR}>
        <div className={styles.fileUpload}>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.positionR}>
      <div></div>

      <div className={styles.fileUpload}>
        <div
          className={styles.fileName}
          style={
            error
              ? { border: "1px solid red", color: "red" }
              : { color: "grey" }
          }
        >
          {tempPlaceHolder}
        </div>

        <div>
          <label className={styles.fileLabel}>Upload</label>
          <input
            multiple={multiple}
            id="upload"
            data-value={"JPG"}
            accept={accept ? accept : "image/*"}
            onChange={handleFileChange}
            className={styles.fileInput}
            type="file"
          />
        </div>
      </div>
      {link && (
        <a className={styles.anchorTag} href={link} target={"_blank"}>
          Preview
        </a>
      )}
    </div>
  );
};

export default UploadImage;
