<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>External Graphic</Name>
    <UserStyle>
      <Title>External Graphic</Title>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
              <Graphic>
                  <ExternalGraphic>
                      <OnlineResource xlink:type="simple" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://upload.wikimedia.org/wikipedia/commons/6/67/OpenLayers_logo.svg" />
                      <Format>image/svg+xml</Format>
                  </ExternalGraphic>
                  <Size>10</Size>
                  <Rotation>90</Rotation>
              </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
