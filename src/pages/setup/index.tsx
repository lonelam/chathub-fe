import api from 'api';
import React, { useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import { baseUrlOptions } from 'utils/constants';

const SetupPage = () => {
  const [openAIToken, setOpenAIToken] = useState('');
  const [wechatyToken, setWechatyToken] = useState('');
  const [puppetType, setPuppetType] = useState('');
  const [isSkipAuth, setIsSkipAuth] = useState(false);
  const [baseUrl, setBaseUrl] = useState(baseUrlOptions[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const handleSkipAuthChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setIsSkipAuth(target.checked);
  }, []);
  const handleBaseUrlChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setBaseUrl(e.target.value);
  }, []);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!isSkipAuth) {
        if (password !== confirmPassword) {
          setValidationMessage('两次密码不一致');
          return;
        } else if (!password) {
          setValidationMessage('需要管理员账户，密码不能为空');
          return;
        }
      }
      api
        .post('auth/setup', {
          password: isSkipAuth ? '' : password,
          openai: {
            token: openAIToken,
            baseUrl,
          },
          padLocal: {
            token: wechatyToken,
            puppetType,
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            console.log(`success, data: `, resp.data);
          }
        })
        .catch();

      // Process the form data
      console.log({ openAIToken, wechatyToken, puppetType });
      // Additional logic to handle the submission
    },
    [baseUrl, confirmPassword, isSkipAuth, openAIToken, password, puppetType, wechatyToken],
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">App Setup 首次启动，填写初始化表单</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex">
          <input
            id="skip-auth"
            type="checkbox"
            className="checkbox-primary mx-2"
            checked={isSkipAuth}
            onChange={handleSkipAuthChange}
          />
          <label className="block text-lg font-bold text-red-800" htmlFor="skip-auth">
            单机运行，无鉴权体系
          </label>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username">
            Admin Username
          </label>

          <div className="mt-1 flex items-center">
            <FaUserAlt className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              value="admin"
              disabled
              placeholder="Username"
              id="username"
              className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="mt-4">
            <label className="block">Password</label>
            <div className="mt-1 flex items-center">
              <FaLock className="h-5 w-5 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                disabled={isSkipAuth}
                onChange={(e) => setPassword(e.target.value)}
                className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block">Confirm Password</label>
            <div className="mt-1 flex items-center">
              <FaLock className="h-5 w-5 text-gray-500" />
              <input
                disabled={isSkipAuth}
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            OpenAI Token
            <span className="link-primary p-2">
              <a href="https://www.gptapi.us/register?aff=S7lC" target="_blank" rel="noreferrer">
                没有的点这里注册，免费额度$1
              </a>
            </span>
          </label>

          <div className="flex gap-2">
            <select
              value={baseUrl}
              onChange={handleBaseUrlChange}
              className="focus:shadow-outline select select-bordered w-48 rounded shadow focus:outline-none"
            >
              {baseUrlOptions.map((url, index) => (
                <option key={index} value={url}>
                  {url}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={openAIToken}
              onChange={(e) => setOpenAIToken(e.target.value)}
              placeholder="Enter OpenAI Token (可以空着，需要后续在管理面板自行添加)"
              className="focus:shadow-outline flex-1 appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Wechaty Token
            <span className="link-primary p-2">
              <a href="https://wechaty.js.org/zh/docs/puppet-services/tokens" target="_blank" rel="noreferrer">
                获取方式说明
              </a>
            </span>
            <span className="link-primary p-2">
              <a href="http://pad-local.com/#/login" target="_blank" rel="noreferrer">
                PadLocal体验7天
              </a>
            </span>
          </label>
          <div className="flex gap-2">
            <select
              value={puppetType}
              onChange={(e) => setPuppetType(e.target.value)}
              className="focus:shadow-outline select select-bordered w-48 rounded border leading-tight text-gray-700 shadow hover:cursor-pointer focus:outline-none"
            >
              <option value="">Select Puppet Type</option>
              <option value="wechaty-puppet-padlocal">wechaty-puppet-padlocal</option>
              <option value="wechaty-puppet-xp">wechaty-puppet-xp</option>
              <option value="wechaty-puppet-wechat">wechaty-puppet-wechat</option>
            </select>
            <input
              type="text"
              value={wechatyToken}
              onChange={(e) => setWechatyToken(e.target.value)}
              placeholder="Enter Wechaty Token (可以空着，需要后续在管理面板自行添加)"
              className="focus:shadow-outline flex-1 appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4 h-4">
          <p className="text-red-500">{validationMessage}</p>
        </div>
        <div className="flex gap-4">
          <button
            id="setup"
            name="action"
            value="setup"
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Setup
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupPage;
