import axios, { AxiosResponse, HttpStatusCode } from "axios";

interface PosterType {
  method: "POST" | "PUT" | "DELETE" | "GET";
  bodyData?: any;
  url: string;
  authToken?: any;
  mode?: "cors" | "no-cors";
  headers?: object | undefined;
}

// By using  this function we can call POST DELETE and PUT methods
const poster = async ({
  url,
  method,
  bodyData,
  authToken,
  mode = "no-cors",
  headers,
}: PosterType) => {
  const config = {
    method: method,
    url: url,
    mode: mode,
    data: bodyData,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...headers,
    },
  };

  return axios(config)
    .then((response: AxiosResponse) => {
      if (HttpStatusCode.Ok === response.status) {
        return response.data;
      } else {
        throw new Error(response?.data?.message);
      }
    })
    .catch((error) => {
      throw error;
      // Swal.fire('Error', error.message, 'error');
    });
};

export { poster };
