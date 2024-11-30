import { useState, useEffect } from 'react';
import { API } from 'utils/api';
import { showError, copy } from 'utils/common';
import { Box, Card, Stack, alpha, Tooltip, IconButton, Typography } from '@mui/material';
import Label from 'ui-component/Label';
import { useTranslation } from 'react-i18next';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const SupportModels = () => {
  const [modelList, setModelList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const fetchModels = async () => {
    try {
      let res = await API.get(`/api/user/models`);
      if (res === undefined) {
        return;
      }
      // 对 res.data.data 里面的 owned_by 进行分组
      let modelGroup = {};
      res.data.data.forEach((model) => {
        if (modelGroup[model.owned_by] === undefined) {
          modelGroup[model.owned_by] = [];
        }
        modelGroup[model.owned_by].push(model.id);
      });
      setModelList(modelGroup);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              mb: expanded ? 2 : 0,
              pr: 5
            }}
          >
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {t('dashboard_index.model_price')}:
            </Typography>

            {!expanded && (
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  gap: 1,
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                  maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)'
                }}
              >
                {Object.entries(modelList)
                  .slice(0, 1)
                  .map(([provider, models]) => (
                    <Box
                      key={provider}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center'
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold'
                        }}
                      >
                        {provider}:
                      </Typography>
                      {models.map((model) => (
                        <Label
                          key={model}
                          variant="soft"
                          color="primary"
                          onClick={() => copy(model, t('dashboard_index.model_name'))}
                          sx={{
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16)
                            }
                          }}
                        >
                          {model}
                        </Label>
                      ))}
                    </Box>
                  ))}
              </Box>
            )}
          </Stack>

          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: -2,
              bgcolor: (theme) => theme.palette.background.paper,
              background: (theme) => `linear-gradient(to right, transparent, ${theme.palette.background.paper} 20%)`,
              pl: 1
            }}
          >
            <Tooltip>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              >
                {expanded ? <ExpandLess sx={{ width: 20 }} /> : <ExpandMore sx={{ width: 20 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {expanded && (
          <Stack spacing={2}>
            {Object.entries(modelList).map(([provider, models]) => (
              <Box key={provider}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                    fontWeight: 'bold'
                  }}
                >
                  {provider}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    pl: 1
                  }}
                >
                  {models.map((model) => (
                    <Label
                      key={model}
                      variant="soft"
                      color="primary"
                      onClick={() => copy(model, t('dashboard_index.model_name'))}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16)
                        }
                      }}
                    >
                      {model}
                    </Label>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default SupportModels;
