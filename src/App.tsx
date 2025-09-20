import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import ExplorePage from "./page/ExplorePage";
import BlogPage from "./page/BlogPage";
import PublishPage from "./page/PublishPage";
import MainLayout from "./layout/MainLayout";
import ItemDetailsPage from "./page/Book/ItemDetailsPage";
import LoginPage from "./page/LoginPage";
import ProfilePage from "./page/profile/ProfilePage";
import ProfileLayout from "./layout/ProfileLayout";
import LibraryPage from "./page/profile/LibraryPage";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import UserHOC from "./components/hoc/UserHOC";
import NotFoundPage from "./page/NotFoundPage";
import Spinner from "./components/Spinner/Spinner";
import BookReaderPage from "./page/BookReaderPage";
import CollectionPage from "./page/CollectionPage";
import UserSurveyPage from "./page/UserSurveyPage";
import TrendingFrom from "./page/admin/TrendingFrom";
import PublicBookReaderPage from "./page/PublicBookReaderPage";
import SupportPage from "./page/SupportPage";
import PrivacyPage from "./page/policy/PrivacyPage";
import TermsPage from "./page/policy/TermsPage";
function App() {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <>
      <Auth0Provider
        // domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
        // clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
        domain="dev-7p08sbulwdh25tmf.us.auth0.com"
        clientId="8YHDcoxF9kzE3PfNZZ4g1UJn2clDast4"
        // redirectUri={window.location.origin}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
        cacheLocation="localstorage"
        useRefreshTokens
        onRedirectCallback={onRedirectCallback}
      >
        <Suspense fallback={<h2>🌀 Loading...</h2>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/trending/form" element={<TrendingFrom />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/user" element={<ProfileLayout />}>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="library" element={<LibraryPage />} />
                </Route>
                <Route path="/publish" element={<PublishPage />} />
              </Route>
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/item/:bookId" element={<ItemDetailsPage />} />
              <Route path="/form" element={<UserSurveyPage />} />
              <Route path="policy">
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/book/reader" element={<BookReaderPage />} />
              <Route
                path="/book/public/reader"
                element={<PublicBookReaderPage />}
              />
            </Route>
          </Routes>
          <UserHOC />
          <Spinner />
        </Suspense>
      </Auth0Provider>
    </>
  );
}

export default App;
