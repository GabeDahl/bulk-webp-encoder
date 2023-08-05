import Clear from '@mui/icons-material/Clear';
import Folder from '@mui/icons-material/Folder';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  BooleanBasicOption,
  NumericalBasicOption,
  PRESETS,
  Preset,
} from 'models/Options';
import {
  reset,
  setBooleanBasicOption,
  setDestinationFolder,
  setNumericalBasicOption,
  setPreset,
} from 'renderer/redux/slices/options';
import { useAppDispatch, useAppSelector } from 'renderer/redux/store';

const presetDescription = `Specify a set of pre-defined parameters to suit a particular type of source material.`;
const booleanBasicOptions: BooleanBasicOption[] = [
  {
    key: 'lossless',
    description:
      'Encode the image without any loss. For images with fully transparent area, the invisible pixel values (R/G/B or Y/U/V) will be preserved only if the "Exact" option (coming soon) is used.',
    displayName: 'Lossless',
  },
  {
    key: 'mt',
    displayName: 'Multi-threading',
    description: `Use multi-threading for encoding, if possible.`,
  },
  {
    key: 'low_memory',
    displayName: 'Low Memory',
    description: `Reduce memory usage of lossy encoding by saving four times the compressed size (typically). This will make the encoding slower and the output slightly different in size and distortion. This flag is only effective for methods 3 and up, and is off by default. Note that leaving this flag off will have some side effects on the bitstream: it forces certain bitstream features like number of partitions (forced to 1). Note that a more detailed report of bitstream size is printed by cwebp when using this option.`,
  },
];

const numericalBasicOptions: NumericalBasicOption[] = [
  {
    key: 'near_lossless',
    description: `Specify the level of near-lossless image preprocessing. This option adjusts pixel values to help compressibility, but has minimal impact on the visual quality. It triggers lossless compression mode automatically. The range is 0 (maximum preprocessing) to 100 (no preprocessing, the default). The typical value is around 60. Note that lossy with -q 100 can at times yield better results.`,
    displayName: 'Near-Lossless Preprocessing',
    inputType: 'slider',
    min: 0,
    max: 0,
  },
  {
    key: 'q',
    description: `Specify the compression factor for RGB channels between 0 and 100. The default is 75.

In case of lossy compression, a small factor produces a smaller file with lower quality. Best quality is achieved by using a value of 100.

In case of lossless compression, a small factor enables faster compression speed, but produces a larger file. Maximum compression is achieved by using a value of 100.`,
    displayName: 'Compression Factor (see info)',
    inputType: 'slider',
    min: 0,
    max: 100,
  },
  {
    key: 'alpha_q',
    description: `Specify the compression factor for alpha compression between 0 and 100. Lossless compression of alpha is achieved using a value of 100, while the lower values result in a lossy compression. The default is 100.`,
    displayName: 'Alpha Compression Factor',
    inputType: 'slider',
    min: 0,
    max: 100,
  },
  {
    key: 'm',
    description: `Specify the compression method to use. This parameter controls the trade off between encoding speed and the compressed file size and quality. Possible values range from 0 to 6. Default value is 4. When higher values are used, the encoder will spend more time inspecting additional encoding possibilities and decide on the quality gain. Lower value can result in faster processing time at the expense of larger file size and lower compression quality.`,
    displayName: 'Compression Method',
    inputType: 'slider',
    min: 0,
    max: 6,
    marks: true,
  },
];

export const OptionsPanel = () => {
  const basicOptions = useAppSelector((state) => state.options.basicOptions);

  const dispatch = useAppDispatch();
  const handleDestinationFolderClick = async () => {
    const folder = await window.electron.ipcRenderer.selectDestinationFolder();
    dispatch(setDestinationFolder(folder[0]));
  };
  return (
    <>
      <Stack p={2} mt={1}>
        <Stack direction="row" mb={1} mt={2}>
          <FormControl size="small" fullWidth>
            <InputLabel id="preset-select-label">Preset</InputLabel>
            <Select
              onChange={(e) => dispatch(setPreset(e.target.value as Preset))}
              size="small"
              labelId="preset-select-label"
              value={basicOptions.preset}
              label="Preset"
            >
              {PRESETS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InfoTip desc={presetDescription} />
        </Stack>
        {booleanBasicOptions.map((option) => (
          <div key={option.key} style={{ minHeight: '50px' }}>
            <Stack direction="row">
              <FormControlLabel
                sx={{ flexGrow: 1 }}
                control={
                  <Checkbox
                    checked={basicOptions[option.key]}
                    onChange={(e) =>
                      dispatch(
                        setBooleanBasicOption({
                          value: e.target.checked,
                          key: option.key,
                        })
                      )
                    }
                  />
                }
                label={option.displayName}
              />
              <InfoTip desc={option.description} />
            </Stack>
          </div>
        ))}
        {numericalBasicOptions.map(
          (option) =>
            (basicOptions.preset === 'none' || option.key === 'q') && (
              <div key={option.key}>
                {option.inputType === 'textField' ? (
                  <Stack direction="row">
                    <TextField
                      onChange={(e) =>
                        dispatch(
                          setNumericalBasicOption({
                            key: option.key,
                            value: Number(e.target.value),
                          })
                        )
                      }
                      sx={{ flexGrow: 1 }}
                      type="number"
                      label={option.displayName}
                      value={basicOptions[option.key]}
                    />
                    <InfoTip desc={option.description} />
                  </Stack>
                ) : (
                  <div>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1">
                        {option.displayName}
                      </Typography>
                      <InfoTip desc={option.description} />
                    </Stack>

                    <Slider
                      onChange={(e, newValue) =>
                        dispatch(
                          setNumericalBasicOption({
                            key: option.key,
                            value: newValue as number,
                          })
                        )
                      }
                      sx={{
                        width: '90%',
                      }}
                      value={basicOptions[option.key]}
                      marks={option.marks}
                      min={option.min || 0}
                      max={option.max || 100}
                    />
                  </div>
                )}
              </div>
            )
        )}
        <Stack
          mt={1}
          mb={1}
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">Output Destination</Typography>
          <Button
            size="small"
            variant="contained"
            endIcon={<Folder />}
            onClick={handleDestinationFolderClick}
          >
            Choose
          </Button>
        </Stack>
        <Stack direction="row">
          <Typography
            variant={basicOptions.destinationFolder ? 'caption' : 'body2'}
          >
            {basicOptions.destinationFolder || `Each File's Original Folder`}
          </Typography>
          {basicOptions.destinationFolder && (
            <IconButton
              onClick={() => dispatch(setDestinationFolder(null))}
              size="small"
            >
              <Clear color="error" />
            </IconButton>
          )}
        </Stack>

        <Button
          sx={{ mt: 2 }}
          onClick={() => dispatch(reset())}
          fullWidth
          variant="outlined"
          color="error"
        >
          Reset Options
        </Button>
      </Stack>
    </>
  );
};
const TT = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    whiteSpace: 'pre-line',
    maxWidth: '280px',
    backgroundColor: '#575757',
  },
}));
const InfoTip = ({ desc }: { desc: string }) => {
  return (
    <TT sx={{ whiteSpace: 'pre-line' }} title={desc}>
      <IconButton>
        <InfoOutlined color="info" />
      </IconButton>
    </TT>
  );
};
