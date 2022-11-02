import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useStore } from "../../store/store";
import { userLogin } from "../../store/userreducer";
import AppNavBar from "../../components/appnavbar.jsx";

const passSchema = z
.object({
    currentPassword:z.string().min(1,{message:"Can not be empty"}),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 character" })
      .regex(
      // eslint-disable-next-line max-len
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*';."_)(+,/:>\]<=?@\\^`|[}{~-])/,
        {
          message:
          // eslint-disable-next-line max-len
          "Password must contain uppercase, lowercase, numeric and special character",
        },
      ),
    passwordConfirm: z.string(),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords are not the same",
    path: ["passwordConfirm"],
  });

function EditPass(){
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({
        resolver: zodResolver(passSchema),
        mode: "all",
      });

      const [store, dispatch] = useStore();
      const { user } = store;
      const [errorMessage, setErrorMessage] = useState("");
      const onSubmit = useCallback((data) => {
        const { currentPassword, password } = data;
        console.log(password);
        axios
          .post(`${process.env.REACT_APP_URL}/api/users/change-password`, { user, currentPassword, password })
          .then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.message) {
              setErrorMessage(res.data.message);
            } else if (res.status === 200) {
              setErrorMessage("Changed password succesfully");
              const storedUser = JSON.parse(localStorage.getItem("currentUser"));
              console.log(storedUser);
              reset();
             
            } else {
              setErrorMessage("Error! Please try again.");
            }
          })
          .catch((err) => {
            console.log("Error:", err);
            setErrorMessage("Error! Please try again.");
          });
      }, [dispatch, reset, user]);
    return(
      <div className="container">
        <AppNavBar/>
        <div className="edit_buttons_main">
          <div className="card col-9 align-self-center p-1 mb-0 mt-4 change-password">
            <div className="card-body">
              <div className="text-center">
                <h2 className="mt-2 mb-3">
                  <b>CHANGE PASSWORD</b>
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="errorMessage">{errorMessage}</p>

                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("currentPassword")}
                    className="btn-border input-style form-control"
                    placeholder="Old Password"
                    type="password"

                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.currentPassword?.message}
                  </small>
                </div>
                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("password")}
                    className="btn-border input-style form-control"
                    placeholder="Password"
                    type="password"

                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.password?.message}
                  </small>
                </div>

                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("passwordConfirm")}
                    className="btn-border form-control input-style"
                    placeholder="Confirm Password"
                    type="password"

                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.passwordConfirm?.message}
                  </small>
                </div>

                <div className="mt-5 row text-center justify-content-center">
                  <button
                    type='submit'
                    className="col-6 btn btn-block btn-success"
                  >
                        CHANGE PASSWORD
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
export default EditPass