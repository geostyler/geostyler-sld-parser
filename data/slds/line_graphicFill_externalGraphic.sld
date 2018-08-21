<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Simple Line</Name>
    <UserStyle>
      <Title>Simple Line</Title>
      <FeatureTypeStyle>
        <Rule>
          <LineSymbolizer>
            <Stroke>
              <GraphicFill>
                <Graphic>
                  <ExternalGraphic>
                    <OnlineResource xlink:type="simple" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://geoserver.org/img/geoserver-logo.png" />
                    <Format>image/png</Format>
                  </ExternalGraphic>
                  <Size>10</Size>
                  <Rotation>90</Rotation>
                </Graphic>
              </GraphicFill>
              <CssParameter name="stroke">#000000</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
              <CssParameter name="stroke-dasharray">13 37</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">mitre</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
