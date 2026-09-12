# ML Model Checkpoint Directory

Place your trained PyTorch `.pth` checkpoint file in this folder.

### Expected File:
`resnet50_best.pth` (or specify path via `MODEL_WEIGHTS_PATH` environment variable)

### Expected State Dict Format:
```python
{
    "model_state_dict": model.state_dict(),
    "class_to_idx": class_to_idx,
    "classes": classes
}
```

### Supported Model Architecture:
- Backbone: `ResNet-50`
- Number of classes: 15 (PlantVillage dataset split)
- Input transform: 224x224 RGB, normalized with ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.

When the `.pth` file is placed here, the backend automatically detects and loads it on startup or retry!
