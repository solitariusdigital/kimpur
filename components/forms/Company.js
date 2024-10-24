import { useContext, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./Form.module.scss";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import loaderImage from "@/assets/loader.png";
import {
  fourGenerator,
  sixGenerator,
  uploadMedia,
  extractParagraphs,
} from "@/services/utility";
import { createCompanyApi } from "@/services/api";

export default function Company() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState("");

  const sourceLink = "https://kimpur.storage.c2.liara.space";
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !manager || !contact || !address || !description || !media) {
      showAlert("همه موارد الزامیست");
      return;
    }

    setLoader(true);
    setDisableButton(true);

    let mediaLink = "";
    let mediaFormat = ".jpg";
    let mediaFolder = "company";
    const subFolder = `com${sixGenerator()}`;
    let mediaId = `img${fourGenerator()}`;
    mediaLink = `${sourceLink}/${mediaFolder}/${subFolder}/${mediaId}${mediaFormat}`;
    await uploadMedia(media, mediaId, mediaFolder, subFolder, mediaFormat);

    const companyObject = {
      name: name.trim(),
      manager: manager.trim(),
      contact: contact.trim(),
      address: address.trim(),
      description: extractParagraphs(description).join("\n\n"),
      media: mediaLink,
      price: {},
      active: true,
    };

    await createCompanyApi(companyObject);
    showAlert("ذخیره شد");
    router.reload(router.asPath);
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const logOut = () => {
    window.location.assign("/");
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <div className={classes.form}>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>
            <span>*</span>
            شرکت
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setName("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          dir="rtl"
          autoComplete="off"
        ></input>
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>
            <span>*</span>
            مدیر
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setManager("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="manager"
          name="manager"
          onChange={(e) => setManager(e.target.value)}
          value={manager}
          dir="rtl"
          autoComplete="off"
        ></input>
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>
            <span>*</span>
            تماس
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setContact("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="phone"
          id="contact"
          name="contact"
          onChange={(e) => setContact(e.target.value)}
          value={contact}
          dir="rtl"
          autoComplete="off"
        ></input>
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>
            <span>*</span>
            آدرس
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setAddress("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          dir="rtl"
          autoComplete="off"
        ></input>
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>
            <span>*</span>
            توضیحات
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setDescription("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <textarea
          type="text"
          id="description"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          dir="rtl"
          autoComplete="off"
        ></textarea>
      </div>
      <div className={classes.formAction}>
        <div className={classes.input}>
          <label className="file">
            <input
              onChange={(e) => {
                setMedia(e.target.files[0]);
              }}
              type="file"
              accept="image/*"
            />
            <p>لوگو</p>
          </label>
          {media !== "" && (
            <div className={classes.preview}>
              <CloseIcon
                className="icon"
                onClick={() => setMedia("")}
                sx={{ fontSize: 16 }}
              />
              <Image
                className={classes.media}
                width={170}
                height={200}
                objectFit="contain"
                src={URL.createObjectURL(media)}
                alt="image"
                priority
              />
            </div>
          )}
        </div>
        <p className={classes.alert}>{alert}</p>
        {loader && (
          <div>
            <Image width={50} height={50} src={loaderImage} alt="isLoading" />
          </div>
        )}
        <button disabled={disableButton} onClick={() => handleSubmit()}>
          ذخیره داده
        </button>
        <div className={classes.logout} onClick={() => logOut()}>
          <p>خروج از پورتال</p>
        </div>
      </div>
    </div>
  );
}
