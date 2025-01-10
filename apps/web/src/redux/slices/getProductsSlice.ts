import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import Cookies from "js-cookie";

const store_id = Cookies.get("storeId");