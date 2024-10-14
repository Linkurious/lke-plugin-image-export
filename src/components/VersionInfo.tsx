import { InfoOutlined } from "@ant-design/icons";
import Button from "antd/es/button/button";
import { version } from "../../package.json";

export const VersionInfo = () => {
  return (
    <div className="version-info">
      <Button
        href="https://doc.linkurious.com/user-manual/latest/visualization-export/#export-visualization-as-image"
        title={`Image export plugin @ v${version}`}
        size="small"
        target="_blank"
        icon={<InfoOutlined />}
      />
    </div>
  );
};
