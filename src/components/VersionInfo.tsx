import { InfoOutlined } from "@ant-design/icons";
import Button from "antd/es/button/button";
import { version } from "../../package.json";

export const VersionInfo = () => {
  return (
    <div className="version-info">
      <Button
        href="https://github.com/linkurious/lke-plugin-image-export"
        title={`Image export plugin @ v${version}`}
        size="small"
        target="_blank"
        icon={<InfoOutlined />}
      />
    </div>
  );
};
